import React, { Component } from 'react';
import './App.css';
import * as data from './data/data.json';
// import GoogleMapReact from 'google-map-react';
import { ReactBingmaps } from 'react-bingmaps';
import config from './config/keys';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faArrowRight } from '@fortawesome/free-solid-svg-icons'
import mapOptions from './config/mapOptions.json';
import { Marker } from './components/Marker';
import { SidePanel } from './components/SidePanel';
import { EventModal } from './components/EventModal';

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
      sidePanel: true,
      currentTab: "events"
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
    this.selectTab = this.selectTab.bind(this);
  }

  static defaultProps = {
    center: [30.2672,-97.7431],
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
    if (this.state.mapElement.zoom <= 12) {
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

  selectTab(newTab) {
    if (newTab === this.state.currentTab) {
      return;
    }
    this.setState({
      currentTab: newTab
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
      console.log(eventsMap);
      return (
        <div className="App">
          <header className="App-header">
            <div className="appContainer" style={{ height: '100vh', width: '100%'  }}>
              <SidePanel
                toggleInfo={this.toggleInfo}
                toggleHovered={this.toggleHovered}
                selectTab={this.selectTab}
                currentEvent={this.state.eventShown}
                eventHovered={this.state.eventHovered}
                events={this.state.events}
                currentTab={this.state.currentTab}
                pushPins={eventsMap}
              >

              </SidePanel>
              <div className="mapContainer">
                <ReactBingmaps
                  bingmapKey={ config.bingMapsKey }
                  center={this.props.center}
                  zoom={this.props.zoom}
                  mapOptions={this.props.options}
                  // onGoogleApiLoaded={({ map, maps }) => this.finalizeApp(map, maps)}
                >
                  {eventsMap}
                </ReactBingmaps>
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


export default App;
