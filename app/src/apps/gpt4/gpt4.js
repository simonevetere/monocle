import React from 'react';
import SpeechRecognition, { useSpeechRecognition } from 'react-speech-recognition';
import { imports } from '../../mpython-common/imports';
import { battery } from '../../mpython-common/battery';
import { render } from '../../mpython-common/render';
import { borders } from '../../mpython-common/borders';
import { date } from '../../mpython-common/date';
import { touch } from '../../mpython-common/touch';
import { welcome } from '../gpt4/welcome';

let cmdRunner;
let appScene = 'controls';
let btnChoice = 1; // 0 left, 1 right, default is right
let curWorkout = 0;
let set = 0;

let workouts = {
  'Squats': [0, 0, 0],
  'Pushups': [0, 0, 0],
  'Situps': [0, 0, 0],
  // 'Curls': [0, 0, 0],
  // 'Lat raise': [0, 0, 0] // can't see more, need scroll or smaller font
};


const showControls = () => {
  cmdRunner(borders(true));
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