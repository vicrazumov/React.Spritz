import React from 'react';
import ReactDOM from 'react-dom';
import ReactSpritz from './ReactSpritz';

it('renders without crashing', () => {
  const div = document.createElement('div');
  ReactDOM.render(<ReactSpritz />, div);
});
