# React Spritz🍷
React implementation of the [Spritz speed-reading technique](http://spritzinc.com/the-science).

![Spritz Sample](https://github.com/vicrazumov/React.Spritz/raw/master/src/media/sample.gif)

Inspired by Luis Ivan's [Spritzer](https://github.com/luisivan/spritzer).

## Installation
```
npm install react-spritz --save
```

Include the stylesheet as follows if needed:
```
import '../node_modules/react-spritz/build/main.css';
```
## Usage
```
<ReactSpritz
  text="Hi, this is React Spritz. Let's play!"
  wpm={400}
  playing
/>
```

* **text** - the text
* **wpm** - words per minute, how fast the words will be displayed
* **playing** - you can control the component by changing this property (```false```, by default)
* **startTimeout** - you can control the timeout on start (in ms, ```1000``` by default)

### Additional props

* **stop** - pass ```true``` if you want to restart the component
* **onStart** - pass ```callback``` to do something on start
* **onPause** - pass ```callback``` to do something on pause (playing=false)
* **onStop** - pass ```callback``` to do something on stop (stop=true)
* **onDisplayNextWord** - pass ```callback``` to do something on displaying the next word

## To-Do

* add controls (stop, play/pause, fwd, rwd, wpm)
* add custom styles support
