import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import * as data from './data/data.json';

class App extends Component {

  constructor (props) {
    super(props);
    let newData = JSON.stringify(data);
    newData = JSON.parse(newData);
    let final = [];
    for (let i = 0; i < newData.default.length; i++) {
      final.push(JSON.parse(newData.default[i]));
    }
    console.log(final);
  }

  render() {
    return (
      <div className="App">
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <p>
            Edit <code>src/App.js</code> and save to reload.
          </p>
          <a
            className="App-link"
            href="https://reactjs.org"
            target="_blank"
            rel="noopener noreferrer"
          >
            Learn React
          </a>
        </header>
      </div>
    );
  }
}

export default App;
