import React, { Component } from 'react';

export class ListEventCard extends Component {
    constructor(props) {
        super(props);
        this.state = {
            intervalBoi: undefined,
            elementScrollContainer: undefined
        }

        this.turnOnTitleScroll = this.turnOnTitleScroll.bind(this);
        this.turnOffTitleScroll = this.turnOffTitleScroll.bind(this);
    }

    turnOnTitleScroll(e) {
        let elementScrollContainer = e.currentTarget.querySelector('.eventCardTitleScrollContainer');
        let elementTitle = e.currentTarget.querySelector('.eventCardTitle');
        let intervalBoi = setInterval(() => {
            if (elementScrollContainer.scrollLeft + elementScrollContainer.offsetWidth < elementTitle.offsetWidth-10) {
                elementScrollContainer.scroll({left: elementScrollContainer.scrollLeft+7, top: 0, behavior: 'smooth'});
            }
        }, 80);
        this.setState({
            intervalBoi: intervalBoi,
            elementScrollContainer: elementScrollContainer
        })
    }

    turnOffTitleScroll() {
        if (this.state.intervalBoi) {
            clearInterval(this.state.intervalBoi);
            let elementScroll = this.state.elementScrollContainer;
            this.setState({
                intervalObject: undefined,
                elementScrollContainer: undefined
            })
            if (elementScroll) {
                elementScroll.scroll(0, 0);
            }
        }
    }

    render() {
        return (
            <div className={`eventCard`} onMouseLeave={() => this.turnOffTitleScroll()} onMouseEnter={(e) => this.turnOnTitleScroll(e)} style={{ backgroundImage: `url(${this.props.event.backgroundImage})` }}>
                <div className="eventCardTitleScrollContainer">
                    <div className="eventCardTitle">
                        {this.props.event.title}
                    </div>
                </div>
                <div className={`eventCardOptions`}>
                    <div className="segmentContainer segmentOptions">
                        <div className="segment">Map</div>
                        <div className="segment">Venue</div>
                        <div className="segment">Details</div>
                        <div className="segment">Do512</div>
                    </div>
                </div>
            </div>
        )
    }
}