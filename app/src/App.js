import { useEffect, useState } from 'react';
import './assets/styles/App.css';
import { ensureConnected } from './bluetooth/js/main';
import WeightLiftingIcon from './assets/icons/uxwing_weight-lifting.svg';
import { execMonocle } from './comms';
import { gpt4App } from './apps/gpt4/gpt4';
import React from 'react';
import SpeechRecognition, { useSpeechRecognition } from 'react-speech-recognition';

const App = () => {
  const [activeApp, setActiveApp] = useState(false);
  const [connected, setConnected] = useState(false);
  const [connecting, setConnecting] = useState(false);

  const logger = async (msg) => {
    console.log('repl response', msg);
    if (msg === 'Connected') {
      setConnecting(false);
      setConnected(true);
    }
  };

  const relayCallback = (msg) => {
    if (msg.trim() === 'trigger b') { // flipped back view
      gpt4App.leftBtnCallback();
    }

    if (msg.trim() === 'trigger a') {
      gpt4App.rightBtnCallback();
    }
  }

  const {
    transcript,
    listening,
    resetTranscript,
    browserSupportsSpeechRecognition
  } = useSpeechRecognition()

  const loadedApp = (
    <div className="loaded-app">
      <h2>Active app: {activeApp}</h2>
      <button type="button" onClick={() => setActiveApp(false)}>Back to apps</button>
    </div>
  );

  const apps = (
    <div className="apps-container">
      <div className="apps">
        <div className="app" onClick={() => setActiveApp('gpt4')}>
          <div className="app-img" style={{backgroundImage: `url(${WeightLiftingIcon})`}}></div>
          <p>gpt4</p>

        </div>
      </div>
      <div className="apps-title">
        <h2>Monocle Apps</h2>
      </div>
    </div>
  );

  const connect = () => {
    setConnecting(true);
    ensureConnected(logger, relayCallback);
  }

  const intro = (
    <div className="intro">
      <h1>Monocle</h1>
      {connecting && <p>{connected ? 'Connected' : 'Connecting...'}</p>}
      {!connecting && <button onClick={() => connect()}>Connect</button>}
      
    </div>
  );

  useEffect(() => {
    if (activeApp) {
      if (activeApp === 'gpt4') {
        gpt4App.run(execMonocle);
      }
    }
  }, [activeApp]);

  return (
    <div className="App">
      {(!connected && !activeApp) && intro}
      {(connected && !activeApp) && apps}
      {activeApp && loadedApp}
    </div>
  );
};

export default App;
