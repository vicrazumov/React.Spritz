# React Spritz🍷
React implementation of the [Spritz speed-reading technique](http://spritzinc.com/the-science).

![](https://raw.githubusercontent.com/vicrazumov/React.Spritz/master/media/sample.gif)

Inspired by Luis Ivan's [Spritzer](https://github.com/luisivan/spritzer).

## **[Demo](https://vicrazumov.github.io/React.Spritz/)**

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

* **normalized** - pass ```true``` if you want longer timeouts for longer words (this will not affect short words)
* **stop** - pass ```true``` if you want to restart the component
* **onStart** - pass ```callback``` to do something on start
* **onPause** - pass ```callback``` to do something on pause (playing=false)
* **onStop** - pass ```callback``` to do something on stop (stop=true)
* **onDisplayNextWord** - pass ```callback``` to do something on displaying the next word
