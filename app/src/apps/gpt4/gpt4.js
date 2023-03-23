import React from 'react';
import { imports } from '../../mpython-common/imports';
import { battery } from '../../mpython-common/battery';
import { render } from '../../mpython-common/render';
import { borders } from '../../mpython-common/borders';
import { date } from '../../mpython-common/date';
import { touch } from '../../mpython-common/touch';
import { gptapp } from '../gpt4/gptapp';
import { welcome } from '../gpt4/welcome';
import { writeText } from '../gpt4/writeText';
import { call_writeText } from '../gpt4/call_writeText';
import { useEffect, useState } from "react";
import { JSEncrypt } from 'jsencrypt'
import { CryptoJS } from 'crypto-js';

let cmdRunner;
let appScene = 'controls';
let btnChoice = 1; // 0 left, 1 right, default is right
let curWorkout = 0;
let set = 0;
const key = fetch("http://localhost:8080/getkey");
const public_key = new JSEncrypt();

const recognition = new window.webkitSpeechRecognition();
recognition.lang = 'en-EN';

recognition.onresult = (event) => {
  const transcript = event.results[0][0].transcript;
  const words = transcript.split(' ');

  showWord(words);
  
  callGpt(transcript);

};


const showWord = (words) => {
  setTimeout(() => {
    if (words.length > 0) {
      cmdRunner(call_writeText(words[0]));
      cmdRunner(render());
      words.shift();
      showWord(words);
    }
  }, 800);
};


const showControls = () => {
  cmdRunner(gptapp());
  cmdRunner(touch());
  cmdRunner(render());
};

const splashScreen = () => {
  cmdRunner(welcome());
  cmdRunner(imports());
  cmdRunner(writeText());
  cmdRunner(render());
}

// https://stackoverflow.com/a/4929629/2710227
const getDate = () => {
  const today = new Date();
  const dd = String(today.getDate()).padStart(2, '0');
  const mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
  const yyyy = today.getFullYear();

  return mm + '/' + dd + '/' + yyyy;
}

export const gpt4App = {
  run: (execMonocle) => {
    cmdRunner = execMonocle;
    splashScreen();
    setTimeout(() => {
      showControls();
    }, 3000);
    console.log(appScene);
  },
  leftBtnCallback: () => { // navigate
    recognition.stop();
  },
  rightBtnCallback: () => { 
  console.log(appScene);
  // select
    if (appScene === 'controls') {
      appScene = 'text-speech';
      showWord(['listening..']);
      textToSpeech();
    }
  }
}

const textToSpeech = () => {
  recognition.start();
  appScene = 'controls'
}

const callGpt = (transcript) => {

  const getData = async (transcript) => {

    const response = await fetch("https://vetere.tech/generate_text?prompt=" + transcript);
    
    const data = await response.json();
    const words = data.response.split(' ');

    setTimeout(() => {showWord(words)}, 8000);
  };

  getData(transcript);

}

export default gpt4App;