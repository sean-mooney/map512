import React, { Component } from 'react';
import { ListEventCard } from './ListEventCard';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowRight } from '@fortawesome/free-solid-svg-icons';

export class SidePanel extends Component {
    constructor(props) {
        super(props);
        this.state = {
            sidePanel: true
        }
        this.toggleSidePanel = this.toggleSidePanel.bind(this);
    }

    toggleSidePanel() {
        let sidePanelElement = document.getElementById("sidePanel");
        sidePanelElement.classList.toggle("expandPanel");
        this.setState({
            sidePanel: sidePanelElement.classList.contains("expandPanel")
        })
    }

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
            <div className="sidePanelContainer">
                <div className="sidePanel expandPanel" id="sidePanel">
                    <div className="sidePanelHeader">
                        <div className="segmentContainer">
                            <div className={`segment ${this.props.currentTab === "events" ? "activated" : ""}`} onClick={() => this.props.selectTab("events")}>
                                Events
                            </div>
                            <div className={`segment ${this.props.currentTab === "venues" ? "activated" : ""}`} onClick={() => this.props.selectTab("venues")}>
                                Venues
                            </div>
                        </div>
                    </div>
                    <div className="eventsList">
                        {eventsList}
                    </div>
                </div>
                <div className={`sidebar-toggle ${this.state.sidePanel ? 'extend-toggled' : ''}`} onClick={() => { this.toggleSidePanel() }}>
                    <FontAwesomeIcon icon={faArrowRight} />
                </div>
            </div>
        )
    }
}