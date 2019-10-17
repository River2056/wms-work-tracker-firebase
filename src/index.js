import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import * as serviceWorker from './serviceWorker';
import App from './App';
const firebase = require('firebase');
require('firebase/firestore');

firebase.initializeApp({
  apiKey: "AIzaSyDGQ7WG6FmHDxjuEk8TbGgykTeQzJCKOQ8",
  authDomain: "work-wms.firebaseapp.com",
  databaseURL: "https://work-wms.firebaseio.com",
  projectId: "work-wms",
  storageBucket: "work-wms.appspot.com",
  messagingSenderId: "159311193094",
  appId: "1:159311193094:web:1d3e546ad6cf45f2984f87",
  measurementId: "G-2FJLWS356E"
});

ReactDOM.render(<App />, document.getElementById('root'));

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
