import React from 'react';
import './App.css';
import { Canvas } from "react-three-fiber";
import Scene from "./views/Scene";

function App() {
  return (
      <Canvas>
          <Scene />
      </Canvas>
  );
}

export default App;
