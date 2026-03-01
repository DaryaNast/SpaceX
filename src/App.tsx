import '@mantine/core/styles.css';
import { MantineProvider } from '@mantine/core';
import './App.css'
import {StrictMode} from "react";
import LaunchContainer from "./components/LaunchContainer/LaunchContainer.tsx";


function App() {

  return (
      <StrictMode>
        <MantineProvider>
            <LaunchContainer/>
        </MantineProvider>
      </StrictMode>
  )
}

export default App
