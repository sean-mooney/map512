import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import * as data from './data/data.json';
import GoogleMapReact from 'google-map-react';
import config from './config/keys';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faMapMarker } from '@fortawesome/free-solid-svg-icons'

class App extends Component {
  
  constructor(props) {
    super(props);
    this.state = {
      events: [],
      ready: false,
      eventShown: null,
      mapElement: null,
      mapApi: null
    }
    let newData = JSON.stringify(data);
    newData = JSON.parse(newData);
    let final = [];
    for (let i = 0; i < newData.default.length; i++) {
      final.push(JSON.parse(newData.default[i]));
    }
    this.state.events = final;
    this.state.ready = true;
    this.finalizeApp = this.finalizeApp.bind(this);
    this.toggleInfo = this.toggleInfo.bind(this);
  }

  static defaultProps = {
    center: {
      lat: 30.2672,
      lng: -97.7431
    },
    zoom: 12,
  };

  finalizeApp(map, maps) {
    this.setState({
      mapElement: map,
      mapApi: maps
    });
  }

  toggleInfo(eventId, event) {
    let latLng = new this.state.mapApi.LatLng(event.location[0]-0.002, event.location[1]);
    this.state.mapElement.zoom = 15;
    this.state.mapElement.panTo(latLng);
    this.setState({
      eventShown: eventId
    });
  }

  render() {
    if (this.state.ready) {
      const eventsMap = this.state.events.map((event, i) => {
        if (!event.location) {
          return;
        }
        return (
          <Marker
            key={i}
            currentEvent={this.state.eventShown}
            event={event}
            lat={event.location[0]}
            lng={event.location[1]}
            toggleInfo={this.toggleInfo}
          />
        );
      });
      return (
        <div className="App">
          <header className="App-header">
            <div style={{ height: '100vh', width: '65vw', marginLeft: '35vw'  }}>
              <GoogleMapReact
                bootstrapURLKeys={{ key: config.googleMapsKey }}
                defaultCenter={this.props.center}
                defaultZoom={this.props.zoom}
                onGoogleApiLoaded={({ map, maps }) => this.finalizeApp(map, maps)}
              >
                {eventsMap}
              </GoogleMapReact>
              <SidePanel
                toggleInfo={this.toggleInfo}
                events={this.state.events}
              >

              </SidePanel>
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

class Marker extends Component {
  render() {
    return (
      <div id={"pin " + this.props.$dimensionKey} className="markerContainer">
        <div className="pin" onClick={() => this.props.toggleInfo(this.props.$dimensionKey, this.props.event)}>
          <FontAwesomeIcon icon={faMapMarker} />
        </div>
        {/* <div className={`markerInfo ${this.props.currentEvent === this.props.$dimensionKey ? 'showInfo' : ''}`}> MARKER INFO POPUP
          <div className="eventTitle">
            {this.props.event.title}
          </div>
        </div> */}
      </div>
    );
  };
}

class SidePanel extends Component {
  render() {
    const eventsList = this.props.events.map((event, i) => {
      if (!event.location) {
        return;
      }
      return (
        <ListEventCard 
          onClick={() => this.props.toggleInfo(this.props.$dimensionKey)}
          key={i}
          event={event}
        />
      );
    });
    return (
      <div className="sidePanel">
        {eventsList}
      </div>
    )
  }
}

class ListEventCard extends Component {
  render() {
    return (
      <div className={`eventCard`} style={{ backgroundImage: `url(${this.props.event.backgroundImage})`}}>
        <div className="eventCardTitle">
        {this.props.event.title}
        </div>
      </div>
    )
  }
}

export default App;
