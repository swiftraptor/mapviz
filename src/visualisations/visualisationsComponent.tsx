import React, { FunctionComponent } from 'react';
import { connect } from 'react-redux';

const MaterialVisualisation: FunctionComponent<{}> = () => {
    return (
        <div>

        </div>
    )
}

const VisualisationsComponent: FunctionComponent<{}> = () => {
    return (
        <div className="visualisations">

        </div>
    )
}

export default connect(null, null)(VisualisationsComponent);