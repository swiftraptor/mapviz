import React, { FunctionComponent } from 'react';
import { connect } from 'react-redux';
import { ResponsiveBar } from '@nivo/bar';
import { groupByMaterial, groupByArea, setMapFilter, resetMapFilter } from '../mapview/mapViewModule';
import { features } from 'process';

// pie chart for material viz was not very nice (transitions were janky)
const MaterialVisualisation: FunctionComponent<{ materials: [], materialFilter: (material: string) => {} }> = ({ materials, materialFilter }) => {
    return (
        <div style={{ height: "45%" }}>
            <ResponsiveBar
                data={materials}
                margin={{ top: 50, bottom: 50 }}
                keys={['count']}
                indexBy={'name'}
                colors={{ scheme: 'nivo' }}
                axisBottom={{
                    legend: 'name',
                    legendPosition: 'middle',
                    legendOffset: 32
                }}
                axisLeft={{
                    legend: 'count',
                    legendPosition: 'middle',
                    legendOffset: 32
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
        <div style={{ height: "50%" }}>
            <ResponsiveBar
                data={areas}
                margin={{ top: 50, bottom: 50 }}
                keys={['count']}
                indexBy={'name'}
                colors={{ scheme: 'nivo' }}
                axisBottom={{
                    legend: 'Area',
                    legendPosition: 'middle',
                    legendOffset: 32
                }}
                axisLeft={{
                    legend: 'Ramps within range',
                    legendPosition: 'middle',
                    legendOffset: 32
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
    resetFilter: () => {}
}> = ({ materials, areas, materialFilter, areaFilter, resetFilter }) => {
    return (
        <div className="visualisations">
            <button className="reset-btn" onClick={resetFilter}>Reset</button>
            <MaterialVisualisation materials={materials} materialFilter={materialFilter} />
            <AreaVisualisation areas={areas} areaFilter={areaFilter} />
        </div>
    )
}

const mapStateToProps = (state) => ({
    materials: groupByMaterial(state),
    areas: groupByArea(state)
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