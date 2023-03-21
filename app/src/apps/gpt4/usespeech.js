import SpeechRecognition, { useSpeechRecognition } from 'react-speech-recognition';

export const Usespeech = () => {
const {
  transcript,
  listening,
  resetTranscript,
  browserSupportsSpeechRecognition
  } = useSpeechRecognition()
}