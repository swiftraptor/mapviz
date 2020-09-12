import React, { FunctionComponent } from 'react';
import { connect } from 'react-redux';
import { ResponsiveBar } from '@nivo/bar';
import { groupByMaterial, setMapFilter, resetMapFilter } from '../mapview/mapViewModule';

const MaterialVisualisation: FunctionComponent<{ materials: [], setFilter: (propName: string, propValue: any) => {} }> = ({ materials, setFilter }) => {
    return (
        <div style={{ height: "33%" }}>
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
                    setFilter('material', node.indexValue.toString())
                }} // fix the prop name here...
            />
        </div>
    )
}

const VisualisationsComponent: FunctionComponent<{
    materials: [],
    setFilter: (propName: string, propValue: any) => {},
    resetFilter: () => {}
}> = ({ materials, setFilter, resetFilter }) => {
    return (
        <div className="visualisations">
            <button className="reset-btn" onClick={resetFilter}>Reset</button>
            <MaterialVisualisation materials={materials} setFilter={setFilter} />
        </div>
    )
}

const mapStateToProps = (state) => ({
    materials: groupByMaterial(state),
})

const mapDispatchToProps = (dispatch) => ({
    setFilter: (propName: string, propValue: any) => {
        dispatch(setMapFilter(propName, propValue))
    },
    resetFilter: () => {
        dispatch(resetMapFilter())
    }
})
export default connect(mapStateToProps, mapDispatchToProps)(VisualisationsComponent);