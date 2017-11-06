import React from 'react';
import PropTypes from 'prop-types';
import './ReactSpritz.css';

const calcHighlightPoint = wordLength => Math.floor(wordLength / 2);
const textToWords = text => text.replace(/^\s+|\s+|\n$/, '').split(/\s+/);

class ReactSpritz extends React.Component {
  constructor(props) {
    super(props);

    const { wpm, text, playing } = props;

    this.state = {
      playing,
      currentWordIndex: -1
    };

    this.tempo = 60000 / wpm;
    this.timer = playing ? setInterval(this._displayNextWord, this.tempo) : null;
    this.words = textToWords(text);
  }

  componentDidMount() {

  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.wpm !== this.props.wpm) {
      clearInterval(this.timer);
      this.tempo = 60000 / nextProps.wpm;
      this.timer = setInterval(this._displayNextWord, this.tempo);
    }

    if (nextProps.text !== this.props.text) {
      this.words = textToWords(nextProps.text);
      this.setState({ currentWordIndex: 0 });
    }

    if (nextProps.stop && !this.props.stop) return this.onStop();

    if (nextProps.playing && !this.props.playing) return this.onPlay();

    if (!nextProps.playing && this.props.playing) return this.onPause();

    return false;
  }

  _displayNextWord = () => {
    const { currentWordIndex } = this.state;
    const { onDisplayNextWord } = this.props;
    const index = currentWordIndex + 1;

    if (onDisplayNextWord) onDisplayNextWord(this.words[index], index);

    this.setState({ currentWordIndex: index });

    if (index === this.words.length - 1) this.onStop();
  }

  onPlay = () => {
    this.setState({ playing: true });
    this.timer = setInterval(this._displayNextWord, this.tempo);

    const { onStart } = this.props;
    if (onStart) onStart();
  }

  onPause = () => {
    clearInterval(this.timer);
    this.setState({ playing: false });

    const { onPause } = this.props;
    if (onPause) onPause();
  }

  onStop = () => {
    clearInterval(this.timer);
    this.setState({ playing: false, currentWordIndex: -1 });

    const { onStop } = this.props;
    if (onStop) onStop();
  }

  render() {
    if (!this.props.text) return null;

    const { currentWordIndex } = this.state;
    const word = currentWordIndex !== -1 && this.words[currentWordIndex];
    const highlightIndex = word && calcHighlightPoint(word.length);

    return (
      <div className="container">
        {
          word &&
          <div className="spritz">
            <div className="leftSide">
              {word.slice(0, highlightIndex)}
            </div>
            <div className="highlight">
              {word[highlightIndex]}
            </div>
            <div className="rightSide">
              {word.slice(highlightIndex + 1)}
            </div>
          </div>
        }
      </div>
    );
  }
}

ReactSpritz.propTypes = {
  wpm: PropTypes.number,
  text: PropTypes.string.isRequired,
  playing: PropTypes.bool,
  stop: PropTypes.bool,
  onStart: PropTypes.func,
  onPause: PropTypes.func,
  onStop: PropTypes.func,
  onDisplayNextWord: PropTypes.func
};

ReactSpritz.defaultProps = {
  wpm: 250,
  playing: false,
  stop: false,
  onStart: null,
  onPause: null,
  onStop: null,
  onDisplayNextWord: null
};

export default ReactSpritz;
