import React from 'react';
import PropTypes from 'prop-types';
import './ReactSpritz.scss';

const isEmoji = word => /(?:[\u2700-\u27bf]|(?:\ud83c[\udde6-\uddff]){2}|[\ud800-\udbff][\udc00-\udfff]|[\u0023-\u0039]\ufe0f?\u20e3|\u3299|\u3297|\u303d|\u3030|\u24c2|\ud83c[\udd70-\udd71]|\ud83c[\udd7e-\udd7f]|\ud83c\udd8e|\ud83c[\udd91-\udd9a]|\ud83c[\udde6-\uddff]|[\ud83c[\ude01-\ude02]|\ud83c\ude1a|\ud83c\ude2f|[\ud83c[\ude32-\ude3a]|[\ud83c[\ude50-\ude51]|\u203c|\u2049|[\u25aa-\u25ab]|\u25b6|\u25c0|[\u25fb-\u25fe]|\u00a9|\u00ae|\u2122|\u2139|\ud83c\udc04|[\u2600-\u26FF]|\u2b05|\u2b06|\u2b07|\u2b1b|\u2b1c|\u2b50|\u2b55|\u231a|\u231b|\u2328|\u23cf|[\u23e9-\u23f3]|[\u23f8-\u23fa]|\ud83c\udccf|\u2934|\u2935|[\u2190-\u21ff])/g.test(word);
const calcHighlightPoint = word => isEmoji(word) ? -1 : Math.floor(word.replace(/[\W]/g, '').length / 2);
const textToWords = text => text.split(/\s+/);
const ONE_MINUTE = 60 * 1000;

const charTimeout = (text, wpm) => {
  if (!text || typeof text !== 'string') throw new Error('Text must be a string');

  const words = textToWords(text);
  const totalTime = Math.trunc(words.length / wpm * ONE_MINUTE);

  return totalTime / words.join('').length;
};

class ReactSpritz extends React.Component {
  constructor(props) {
    super(props);

    const { wpm, text, startTimeout } = props;

    this.charTempo = charTimeout(text, wpm);
    this.standardTempo = Math.trunc(ONE_MINUTE / wpm);
    this.words = textToWords(text);

    this.state = {
      currentWordIndex: startTimeout ? 0 : -1,
    };
  }

  componentDidMount() {
    if (this.props.playing)
      window.requestAnimationFrame(() => this.onPlay());
  }

  componentDidUpdate(prevProps) {
    if (prevProps.wpm !== this.props.wpm) {
      clearTimeout(this.timer);
      this.standardTempo = Math.trunc(ONE_MINUTE / this.props.wpm);
      this.charTempo = charTimeout(this.props.text, this.props.wpm);
      this.timer = setTimeout(this._displayNextWord, this._getNextWordTimeout());
    }

    if (prevProps.text !== this.props.text) {
      this.words = textToWords(this.props.text);
      this.setState({ currentWordIndex: 0 });
    }

    if (this.props.stop && !prevProps.stop) return this.onStop();

    if (this.props.playing && !prevProps.playing) return window.requestAnimationFrame(() => this.onPlay());

    if (!this.props.playing && prevProps.playing) return this.onPause();

    return false;
  }

  componentWillUnmount() {
    clearTimeout(this.timer);
    clearTimeout(this.startTimeout);
  }

  _getNextWord = () => {
    const { currentWordIndex } = this.state;
    const index = currentWordIndex + 1;

    if (index === this.words.length) return {};

    return {
      word: this.words[index],
      index
    };
  }

  _getNextWordTimeout = () => {
    const { currentWordIndex } = this.state;
    const word = this.words[currentWordIndex];
    const { normalized } = this.props;

    let wordTimeout = normalized ? word.length * this.charTempo : this.standardTempo;

    const delay = /^\(|[,.)]$/.test(word) || isEmoji(word);
    if (delay) wordTimeout += this.standardTempo;

    // ensure, the timeout between words is not less than a wpm
    return Math.max(wordTimeout, this.standardTempo);
  }

  _displayNextWord = () => {
    const { word, index } = this._getNextWord();
    if (!word) return this.onStop();

    const { onDisplayNextWord } = this.props;

    if (onDisplayNextWord) onDisplayNextWord(word, index);

    this.setState({ currentWordIndex: index });

    this.timer = setTimeout(this._displayNextWord, this._getNextWordTimeout());
  }

  _start = () => {
    this.timer = setTimeout(this._displayNextWord, this._getNextWordTimeout());

    const { onStart } = this.props;
    if (onStart) onStart();
  }

  onPlay = () => {
    const { startTimeout } = this.props;
    this.setState({ playing: true });

    if (!startTimeout) {
      return this._start();
    }

    this.startTimeout = setTimeout(this._start, startTimeout - 300);
  }

  onPause = () => {
    clearTimeout(this.timer);
    this.setState({ playing: false });

    const { onPause } = this.props;
    if (onPause) onPause();
  }

  onStop = () => {
    clearTimeout(this.timer);
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
            style={{transition: `transform linear ${this.props.startTimeout}ms`}}
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
  onDisplayNextWord: PropTypes.func,
  normalized: PropTypes.bool,
};

ReactSpritz.defaultProps = {
  wpm: 250,
  startTimeout: 800,
  playing: false,
  stop: false,
  onStart: null,
  onPause: null,
  onStop: null,
  onDisplayNextWord: null
};

export default ReactSpritz;
