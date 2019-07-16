import React, { Component } from 'react';
import { ListEventCard } from './ListEventCard';

export class SidePanel extends Component {
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
        )
    }
}