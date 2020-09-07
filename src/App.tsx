import React from 'react';
import './App.css';
import MapComponent from './mapview/mapViewComponent'
import VisualisationsComponent from './visualisations/visualisationsComponent';

function App() {
  return (
    <div className="App">
      <MapComponent />
      <VisualisationsComponent />
    </div>
  );
}

export default App;
