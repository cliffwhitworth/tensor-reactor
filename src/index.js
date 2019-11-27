import React from 'react';
import ReactDOM from 'react-dom';
// import './index.css';
// import App from './App';
// import App from './functionalComponent/App';
// import App from './classComponent/App';
// import App from './unsplash/App';
// import App from './redux';
// import App from './json';
// import App from './hooks';
import App from './tfvis';

import * as serviceWorker from './serviceWorker';
ReactDOM.render(<App />, document.querySelector('#root'));

// https://github.com/facebook/create-react-app/
// https://developers.google.com/web/fundamentals/primers/service-workers
serviceWorker.unregister();