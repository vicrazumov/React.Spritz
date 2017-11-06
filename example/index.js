import React from 'react';
import ReactDOM from 'react-dom';
import ReactSpritz from '../src/ReactSpritz';

ReactDOM.render(
  <div>
    <ReactSpritz
      text="To understand Spritz, you must understand Rapid Serial Visual Presentation (RSVP). RSVP is a common speed-reading technique used today. However, RSVP was originally developed for psychological experiments to measure human reactions to content being read. When RSVP was created, there wasn’t much digital content and most people didn’t have access to it anyway. The internet didn’t even exist yet.  With traditional RSVP, words are displayed either left-aligned or centered. Figure 1 shows an example of a center-aligned RSVP, with a dashed line on the center axis
When you read a word, your eyes naturally fixate at one point in that word, which visually triggers the brain to recognize the word and process its meaning. In Figure 1, the preferred fixation point (character) is indicated in red. In this figure, the Optimal Recognition Position (ORP) is different for each word. For example, the ORP is only in the middle of a 3-letter word. As the length of a word increases, the percentage that the ORP shifts to the left of center also increases. The longer the word, the farther to the left of center your eyes must move to locate the ORP."
      playing
    />
  </div>,
  document.getElementById('root')
);
