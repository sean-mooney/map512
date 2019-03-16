import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import * as data from './data/data.json';
import GoogleMapReact from 'google-map-react';
import config from './config/keys';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faMapMarker } from '@fortawesome/free-solid-svg-icons'

class Marker extends Component {
  constructor(props) {
    super(props);
  }
  render(props) {
    return (
      <div className="markerContainer">
        <div className="pin">
          <FontAwesomeIcon icon={faMapMarker} />
        </div>
        <div className="markerInfo">
          <div className="eventTitle">
            {this.props.title}
          </div>
        </div>
      </div>
    );
  };
}

class App extends Component {
  state = {
    events: [],
    ready: false
  }
  constructor(props) {
    super(props);
    
    let newData = JSON.stringify(data);
    newData = JSON.parse(newData);
    let final = [];
    for (let i = 0; i < newData.default.length; i++) {
      final.push(JSON.parse(newData.default[i]));
    }
    this.state.events = final;
    this.state.ready = true;
  }

  static defaultProps = {
    center: {
      lat: 30.2672,
      lng: -97.7431
    },
    zoom: 12,
  };


  render() {
    if (this.state.ready) {
      const eventsList = this.state.events.map((event) => {
        if (!event.location) {
          console.log('pooop',event);
          return;
        }
        return (
          <Marker
            lat={event.location[0]}
            lng={event.location[1]}
            title={event.title}
          />
        );
      });
      return (
        <div className="App">
          <header className="App-header">
            <div style={{ height: '100vh', width: '100%' }}>
              <GoogleMapReact
                bootstrapURLKeys={{ key: config.googleMapsKey }}
                defaultCenter={this.props.center}
                defaultZoom={this.props.zoom}
              >
                {eventsList}
              </GoogleMapReact>
            </div>
          </header>
        </div>
      );
    } else {
      return (
        <div> Loading...</div >
      );
    }

  }
}

export default App;
