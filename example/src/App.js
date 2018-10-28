import React, { Component } from 'react';
import './App.css';

import ReactSpritz from 'react-spritz';
import '../node_modules/react-spritz/build/main.css';

class App extends Component {
  constructor() {
    super();

    this.state = {
      finished: true,
      started: false,
    }

    this.text = `Lorem Ipsum ist ein einfacher Demo-Text für die Print- und Schriftindustrie. Lorem Ipsum ist in der Industrie bereits der Standard Demo-Text seit 1500, als ein unbekannter Schriftsteller eine Hand voll Wörter nahm und diese durcheinander warf um ein Musterbuch zu erstellen. Es hat nicht nur 5 Jahrhunderte überlebt, sondern auch in Spruch in die elektronische Schriftbearbeitung geschafft (bemerke, nahezu unverändert). Bekannt wurde es 1960, mit dem erscheinen von "Letraset", welches Passagen von Lorem Ipsum enhielt, so wie Desktop Software wie "Aldus PageMaker" - ebenfalls mit Lorem Ipsum.`;
  }

  render() {
    return (
      <div className="App">
        <ReactSpritz
          text={this.text}
          wpm={250}
          playing={true}
        />
      </div>
    );
  }
}

export default App;
