# React Spritz🍷
React implementation of the [Spritz speed-reading technique](http://spritzinc.com/the-science).

Inspired by Luis Ivan's [Spritzer](https://github.com/luisivan/spritzer).

## Installation
```
npm install react-spritz --save
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
* **playing** - you can control the component by changing this property (false, by default)

### Additional props

* **stop** - pass *true* if you want to restart the component
* **onStart** - pass callback to act on start
* **onPause** - pass callback to act on pause (playing=false)
* **onStop** - pass callback to act on stop (stop=true)
* **onDisplayNextWord** - pass callback to act on displaying next word

## To-Do

* add controls (stop, play/pause, fwd, rwd, wpm)
* add custom styles support
