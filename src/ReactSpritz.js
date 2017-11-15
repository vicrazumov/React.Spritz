import React from 'react';
import PropTypes from 'prop-types';
import './ReactSpritz.scss';

const isEmoji = word => /(?:[\u2700-\u27bf]|(?:\ud83c[\udde6-\uddff]){2}|[\ud800-\udbff][\udc00-\udfff]|[\u0023-\u0039]\ufe0f?\u20e3|\u3299|\u3297|\u303d|\u3030|\u24c2|\ud83c[\udd70-\udd71]|\ud83c[\udd7e-\udd7f]|\ud83c\udd8e|\ud83c[\udd91-\udd9a]|\ud83c[\udde6-\uddff]|[\ud83c[\ude01-\ude02]|\ud83c\ude1a|\ud83c\ude2f|[\ud83c[\ude32-\ude3a]|[\ud83c[\ude50-\ude51]|\u203c|\u2049|[\u25aa-\u25ab]|\u25b6|\u25c0|[\u25fb-\u25fe]|\u00a9|\u00ae|\u2122|\u2139|\ud83c\udc04|[\u2600-\u26FF]|\u2b05|\u2b06|\u2b07|\u2b1b|\u2b1c|\u2b50|\u2b55|\u231a|\u231b|\u2328|\u23cf|[\u23e9-\u23f3]|[\u23f8-\u23fa]|\ud83c\udccf|\u2934|\u2935|[\u2190-\u21ff])/g.test(word)
const calcHighlightPoint = word => isEmoji(word) ? -1 : Math.floor(word.replace(/[\W]/g, '').length / 2);
const textToWords = text => text.split(/\s+/);

class ReactSpritz extends React.Component {
  constructor(props) {
    super(props);

    const { wpm, text, startTimeout } = props;

    this.tempo = 60000 / wpm;
    this.words = textToWords(text);

    this.state = {
      currentWordIndex: startTimeout ? 0 : -1,
    }
  }

  componentDidMount() {
    if (this.props.playing) this.onPlay();
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

  componentWillUnmount() {
    clearInterval(this.timer);
    clearTimeout(this.startTimeout);
  }

  _displayNextWord = () => {
    if (this.delay) return (this.delay = false);

    const { currentWordIndex } = this.state;
    const { onDisplayNextWord } = this.props;
    const index = currentWordIndex + 1;
    const word = this.words[index];

    if (onDisplayNextWord) onDisplayNextWord(word, index);

    this.setState({ currentWordIndex: index });

    if (index === this.words.length - 1) this.onStop();

    this.delay = /^\(|[,\.\)]$/.test(word) || isEmoji(word);
  }

  _start = () => {
    this.timer = setInterval(this._displayNextWord, this.tempo);

    const { onStart } = this.props;
    if (onStart) onStart();
    this.setState({ playing: true });
  }

  onPlay = () => {
    const { startTimeout } = this.props;

    // delay if a word has brackets, commas or periods
    this.delay = !!startTimeout;

    if (!startTimeout) {
      return this._start();
    }

    this.startTimeout = setTimeout(this._start, startTimeout);
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

    const { currentWordIndex, playing } = this.state;
    const word = currentWordIndex !== -1 && this.words[currentWordIndex];
    const highlightIndex = word && calcHighlightPoint(word);

    return (
      <div className="container">
        {
          word &&
          <div className="spritz">
            <div className="leftSide">
              {highlightIndex !== -1 && word.slice(0, highlightIndex)}
            </div>
            <div className="highlight">
              {highlightIndex === -1 ? word : word[highlightIndex]}
            </div>
            <div className="rightSide">
              {highlightIndex !== -1 && word.slice(highlightIndex + 1)}
            </div>
          </div>
        }
        {
          word && this.props.startTimeout &&
          <div
            className={playing ? 'timeoutBlockHidden' : 'timeoutBlock'}
          ></div>
        }
      </div>
    );
  }
}

ReactSpritz.propTypes = {
  wpm: PropTypes.number,
  startTimeout: PropTypes.number,
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
  startTimeout: 1000,
  playing: false,
  stop: false,
  onStart: null,
  onPause: null,
  onStop: null,
  onDisplayNextWord: null
};

export default ReactSpritz;
