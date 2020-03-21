import React, { Component } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMapMarker } from '@fortawesome/free-solid-svg-icons';

export class Marker extends Component {
    render() {
        return (
            <div id={"pin " + this.props.event.eventId} className="markerContainer">
                <div className="pin" onClick={() => this.props.toggleInfo(this.props.event)}>
                    <FontAwesomeIcon icon={faMapMarker} />
                </div>
                <div onClick={e => e.stopPropagation()} className={`markerInfo ${this.props.currentEvent === this.props.event.eventId ? 'showInfo' : ''}`}>
                    <div className="markerDescription">
                        <span className="venueName">{this.props.venueEventListByLat[this.props.event.location[0]].events.length}</span>
                        event{this.props.venueEventListByLat[this.props.event.location[0]].events.length > 1 ? "s" : ""} at
                        <span className="venueName">{this.props.venueEventListByLat[this.props.event.location[0]].venue}</span>
                    </div>
                    <div className="viewButton">View</div>
                </div>
            </div>
        );
    };
}