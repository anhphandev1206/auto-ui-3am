import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import DndFlow from './DndFlow/DndFlow';
import AutoRunScript from './AutoRunScript/AutoRunScript';

function App() {
  return (
    <Router>
      <div>        
        <Routes>
          <Route path="/" element={<DndFlow />} />     
          {/* <Route path="/autorunscript" component={AutoRunScript} />      */}
          <Route path="/autorunscript" element={<AutoRunScript />} />
        </Routes>
      </div>
    </Router>
    // <Router>
    //   <div>
    //     <Routes>
    //       <Route path="/" element={<DndFlow />} />  {/* Trang DnDFlow */}
    //       <Route path="/autoscript" element={<AutoRunScript />} />  {/* Trang AutoScript */}
    //     </Routes>
    //   </div>
    // </Router>
    //  <div className="App" style={{ width: "100%", height: "100vh" }}>
    //     <DndFlow />
    //   </div>   
  );
}

export default App;
