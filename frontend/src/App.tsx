import React from "react";
import Recorder from "components/Recorder";
import Transcript from "components/Transcript";

const App: React.FC = () => {
  return (
    <div>
      <h1>Live Video/Audio Transcript</h1>
      <Recorder />
      <Transcript transcripts={[]} />
    </div>
  );
};

export default App;
