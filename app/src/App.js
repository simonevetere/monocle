import { useEffect, useState } from 'react';
import './assets/styles/App.css';
import { ensureConnected } from './bluetooth/js/main';
import WeightLiftingIcon from './assets/icons/uxwing_weight-lifting.svg';
import { execMonocle } from './comms';
import { gpt4App } from './apps/gpt4/gpt4';
import React from 'react';
import { JSEncrypt } from 'jsencrypt'
import { CryptoJS } from 'crypto-js';

const App = () => {
  const [activeApp, setActiveApp] = useState(false);
  const [connected, setConnected] = useState(false);
  const [connecting, setConnecting] = useState(false);
  const [email, setEmail] = useState('');
  const [login, setLogin] = useState(false);
  const key = "";
  const public_key = new JSEncrypt();

  const handleChange = event => {
    setEmail(event.target.value);
  };

  const getkey = () => {
    return fetch("http://localhost:8080/getkey");
  }

  const sendmail = (email) => {
    const key = getkey();
    public_key.setPublicKey(key);
    const encrypted = public_key.encrypt(email);
    
    return fetch("http://localhost:8080/sendmail?mail="+ encrypted);
  }


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

  const checkmail = (email) => {
    if(email.email == ""){
      return false;
    } else {
      dologin(email);
    }
    console.log(email.email)
  }

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

  const dologin = (email) => {
    setLogin(sendmail(email));

  }

  const intro = (
    <div className="intro">
      {connecting && <><h1>Monocle</h1><p>{connected ? 'Connected' : 'Connecting...'}</p></>}
      {!connecting && login && <><h1>Monocle</h1><button onClick={() => connect()}>Connect</button></>}
      {!login && <><h1>Monocle</h1><p><br />plesase insert your email</p><input type="email" id="email" name="email" onChange={handleChange} value={email} placeholder="email@example.com" type="email"/><button onClick={() => checkmail({email})}>login</button></>}
      
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
      {(!login ) && intro}
      {(!connected && !activeApp && login) && intro}
      {(connected && !activeApp) && apps}
      {activeApp && loadedApp}
    </div>
  );
};

export default App;
