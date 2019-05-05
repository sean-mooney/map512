import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import * as data from './data/data.json';
import GoogleMapReact from 'google-map-react';
import config from './config/keys';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faMapMarker, faArrowRight } from '@fortawesome/free-solid-svg-icons'
import mapOptions from './config/mapOptions.json';

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      events: [],
      ready: false,
      eventShown: null,
      eventHovered: null,
      mapElement: null,
      mapApi: null,
      eventsPerVenueArrayByLat: {},
      sidePanel: false
    }
    let newData = JSON.stringify(data);
    newData = JSON.parse(newData);
    let final = [];
    for (let i = 0; i < newData.default.length; i++) {
      let newEvent = JSON.parse(newData.default[i])
      newEvent.eventId = i;
      final.push(newEvent);

      if (newEvent.location) {
        if (!this.state.eventsPerVenueArrayByLat[newEvent.location[0]]) {
          this.state.eventsPerVenueArrayByLat[newEvent.location[0]] = {}
          this.state.eventsPerVenueArrayByLat[newEvent.location[0]].venue = newEvent.venue;          
          this.state.eventsPerVenueArrayByLat[newEvent.location[0]].events = [];
        }
        this.state.eventsPerVenueArrayByLat[newEvent.location[0]].events.push(newEvent);
      }
    }
    this.state.events = final;
    this.state.ready = true;
    this.finalizeApp = this.finalizeApp.bind(this);
    this.toggleInfo = this.toggleInfo.bind(this);
    this.toggleHovered = this.toggleHovered.bind(this);
    this.toggleSidePanel = this.toggleSidePanel.bind(this);
  }

  static defaultProps = {
    center: {
      lat: 30.2672,
      lng: -97.7431
    },
    zoom: 12,
    options: mapOptions
  };

  finalizeApp(map, maps) {
    this.setState({
      mapElement: map,
      mapApi: maps
    });
  }

  toggleInfo(event) {
    let latLng = new this.state.mapApi.LatLng(event.location[0]-0.0005, event.location[1]);
    if (this.state.mapElement.zoom < 15) {
      this.state.mapElement.zoom = 15;
    }
    this.state.mapElement.panTo(latLng);
    this.setState({
      eventShown: event.eventId
    });
  }

  toggleHovered(eventId) {
    if (this.state.eventHovered === eventId || eventId === null) {
      // this.setState({
      //   eventHovered: null
      // });
    } else {
      this.setState({
        eventHovered: eventId
      });
    }
  }

  toggleSidePanel() {
    let sidePanelElement = document.getElementById("sidePanel");
    sidePanelElement.classList.toggle("expandPanel");
    this.setState({
      sidePanel: sidePanelElement.classList.contains("expandPanel")
    })
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
            eventHovered={this.state.eventHovered}
            venueEventListByLat={this.state.eventsPerVenueArrayByLat}
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
            <div className="appContainer" style={{ height: '100vh', width: '100%'  }}>
              <SidePanel
                toggleInfo={this.toggleInfo}
                toggleHovered={this.toggleHovered}
                currentEvent={this.state.eventShown}
                eventHovered={this.state.eventHovered}
                events={this.state.events}
              >

              </SidePanel>
              <div className="mapContainer">
                <GoogleMapReact
                  bootstrapURLKeys={{ key: config.googleMapsKey }}
                  defaultCenter={this.props.center}
                  defaultZoom={this.props.zoom}
                  options={this.props.options}
                  onGoogleApiLoaded={({ map, maps }) => this.finalizeApp(map, maps)}
                >
                  {eventsMap}
                </GoogleMapReact>
                <div className={`togglePanel ${this.state.sidePanel ? 'extendToggle' : ''}`} onClick={() => { this.toggleSidePanel() }}>
                  <FontAwesomeIcon icon={faArrowRight} />
                </div>
              </div>
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
      <div id={"pin " + this.props.event.eventId} className="markerContainer">
        <div className="pin" onClick={() => this.props.toggleInfo(this.props.event)}>
          <FontAwesomeIcon icon={faMapMarker} />
        </div>
        <div className={`markerInfo ${this.props.currentEvent === this.props.event.eventId ? 'showInfo' : ''}`}>
          <div className="markerDescription">
            <span className="venueName">{this.props.venueEventListByLat[this.props.event.location[0]].events.length}</span> events at <span className="venueName">{this.props.venueEventListByLat[this.props.event.location[0]].venue}</span>
          </div>
          <div className="popupArrow">
          </div>
        </div>
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
          onMouseEnter={() => this.props.toggleHovered(event.eventId)}
          onMouseLeave={() => this.props.toggleHovered(event.eventId)}
          onClick={() => this.props.toggleInfo(event.eventId)}
          key={i}
          event={event}
        />
      );
    });
    return (
      <div className="sidePanel" id="sidePanel">
        <div className="eventsList">
          {eventsList}
        </div>
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
