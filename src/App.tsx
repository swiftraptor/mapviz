import React from 'react';
import './App.css';
import MapComponent from './mapview/mapViewComponent'
import VisualisationsComponent from './visualisations/visualisationsComponent';

// add some sort of panel for currently highlighted entity!
function App() {
  return (
    <div className="App">
      <MapComponent />
      <VisualisationsComponent />
    </div>
  );
}

export default App;
