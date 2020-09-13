import React, { FunctionComponent } from 'react';
import { connect } from 'react-redux';
import { ResponsiveBar } from '@nivo/bar';
import { groupByMaterial, groupByArea, setMapFilter, resetMapFilter } from '../mapview/mapViewModule';

// pie chart for material viz was not very nice (transitions were janky)
const MaterialVisualisation: FunctionComponent<{ materials: [], materialFilter: (material: string) => {} }> = ({ materials, materialFilter }) => {
    return (
        <div style={{ height: "45%" }}>
            <ResponsiveBar
                data={materials}
                margin={{ top: 50, bottom: 50, left: 50 }}
                keys={['count']}
                indexBy={'name'}
                padding={0.3}
                colors={'#00B34A'}
                labelTextColor={'white'}
                axisBottom={{
                    legend: 'Material',
                    legendPosition: 'middle',
                    legendOffset: 32
                }}
                axisLeft={{
                    legend: 'Number of Ramps',
                    legendPosition: 'middle',
                    legendOffset: -40
                }}
                onClick={(node, event) => {
                    event.preventDefault()
                    materialFilter(node.indexValue.toString())
                }} // fix the prop name here...
            />
        </div>
    )
}

const AreaVisualisation: FunctionComponent<{
        areas: any[],
        areaFilter: (areaCategory: string) => {}
}> = ({ areas, areaFilter }) => (
    <>
        <div style={{ height: "45%" }}>
            <ResponsiveBar
                data={areas}
                margin={{ top: 50, bottom: 50, left: 50 }}
                keys={['count']}
                indexBy={'name'}
                colors={'#198BFF'}
                labelTextColor={'white'}
                axisBottom={{
                    legend: 'Area',
                    legendPosition: 'middle',
                    legendOffset: 32
                }}
                axisLeft={{
                    legend: 'Ramps within range',
                    legendPosition: 'middle',
                    legendOffset: -40
                }}
                onClick={(node, event) => {
                    event.preventDefault()
                    areaFilter(node.indexValue.toString())
                }} // fix the prop name here...
            />
        </div>
    </>
);

const VisualisationsComponent: FunctionComponent<{
    materials: [],
    areas: [],
    areaFilter: (areaCategory: string) => {},
    materialFilter: (material: string) => {},
    resetFilter: () => {},
    filterActive: boolean
}> = ({ materials, areas, materialFilter, areaFilter, resetFilter, filterActive }) => {
    return (
        <div className="visualisations">
            <MaterialVisualisation materials={materials} materialFilter={materialFilter} />
            <AreaVisualisation areas={areas} areaFilter={areaFilter} />
            <div className="visualisation-actions">
                <button className={`btn-reset ${ !filterActive ? 'disabled': null }`} onClick={resetFilter} disabled={!filterActive}>Reset Filter</button>
            </div>
        </div>
    )
}

const mapStateToProps = (state) => ({
    materials: groupByMaterial(state),
    areas: groupByArea(state),
    filterActive: !!state.map.filter
})

const mapDispatchToProps = (dispatch) => ({
    materialFilter: (propValue: string) => {
        dispatch(setMapFilter((feature) => feature.properties['material'] === propValue))
    },
    areaFilter: (areaCategory: string) => {
        console.log(areaCategory)
        const parts = areaCategory.split('-').map(part => Number(part))
        dispatch(setMapFilter((feature) => feature.properties.area_ >= parts[0] && feature.properties.area_ < parts[1]))
    },
    resetFilter: () => {
        dispatch(resetMapFilter())
    }
})
export default connect(mapStateToProps, mapDispatchToProps)(VisualisationsComponent);