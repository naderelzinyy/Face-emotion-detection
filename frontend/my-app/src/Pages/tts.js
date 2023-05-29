import React, {useState} from "react";
import {useSpeechSynthesis} from 'react-speech-kit';


const App = () => {
  const [value, setValue] = useState("");
  const {speak, voices} = useSpeechSynthesis();

  return (
    <div className="App">
        <div className='group'>
          <h1>TTS</h1>
        </div>
        <div className='group'>
          <textarea rows={10} value={value} onChange={(e) => setValue(e.target.value)}></textarea>
        </div>
        <div className='group'>
          <button onClick={() => speak({text: value, voice: voices[6]})}>Say</button>
        </div>
    </div>
  );
}

export default App;
