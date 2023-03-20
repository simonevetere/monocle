import React from 'react';
import SpeechRecognition, { useSpeechRecognition } from 'react-speech-recognition';
import { imports } from '../../mpython-common/imports';
import { battery } from '../../mpython-common/battery';
import { render } from '../../mpython-common/render';
import { borders } from '../../mpython-common/borders';
import { date } from '../../mpython-common/date';
import { touch } from '../../mpython-common/touch';
import { gptapp } from '../gpt4/gptapp';
import { welcome } from '../gpt4/welcome';

let cmdRunner;
let appScene = 'controls';
let btnChoice = 1; // 0 left, 1 right, default is right
let curWorkout = 0;
let set = 0;

const showControls = () => {
  cmdRunner(borders(true));
  cmdRunner(gptapp());
  cmdRunner(touch());
  cmdRunner(render());
};

const splashScreen = () => {
  cmdRunner(welcome());
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
  console.log('appScene');
  console.log('left');
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
  console.log(SpeechRecognition.startListening);
}

export default gpt4App;