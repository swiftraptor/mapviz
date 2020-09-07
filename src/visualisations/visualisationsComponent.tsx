import React, { FunctionComponent } from 'react';
import { connect } from 'react-redux';
import { ResponsiveBar } from '@nivo/bar';
import { groupByMaterial } from '../mapview/mapViewModule';

const MaterialVisualisation: FunctionComponent<{ materials: [] }> = ({ materials }) => {
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
            />
        </div>
    )
}

const VisualisationsComponent: FunctionComponent<{ materials: [] }> = ({ materials }) => {
    return (
        <div className="visualisations">
            <MaterialVisualisation materials={materials} />
        </div>
    )
}

const mapStateToProps = (state) => ({
    materials: groupByMaterial(state)
})
export default connect(mapStateToProps, null)(VisualisationsComponent);