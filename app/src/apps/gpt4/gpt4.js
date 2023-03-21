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

let cmdRunner;
let appScene = 'controls';
let btnChoice = 1; // 0 left, 1 right, default is right
let curWorkout = 0;
let set = 0;

const recognition = new window.webkitSpeechRecognition();
recognition.lang = 'it-IT';

recognition.onresult = (event) => {
  const transcript = event.results[0][0].transcript;
  const words = transcript.split(' ');

  for (const parola of words) {
    setTimeout(() => {
      cmdRunner(writeText(parola));
      cmdRunner(render());
      console.log(Date.now())
    }, 1500);
  }  
};

const showControls = () => {
  cmdRunner(borders(true));
  cmdRunner(gptapp());
  cmdRunner(touch());
  cmdRunner(render());
};

const splashScreen = () => {
  cmdRunner(welcome());
  cmdRunner(imports());
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
      textToSpeech();
    }
  }
}

const textToSpeech = () => {
  recognition.start();
  console.log('porcodio');
  appScene = 'controls'
}

export default gpt4App;