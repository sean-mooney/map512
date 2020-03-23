import React, { Component } from 'react';

export class EventModal extends Component {
    constructor(props) {
        super(props);
        this.state = {
            event: null
        }
    }
    componentDidUpdate(prevProps) {
        if (prevProps.event != this.props.event) {
            this.setState({ event: this.props.event })
        }
    }
    render() {
        return (
            this.state.event ?
                <div className={`modalWrapper ${!this.state.event ? "no-pointer-events" : ""}`} onClick={() => {this.props.showInfo(null, true)}}>
                    <div className="modalContainer">
                        <div className="modalHeader">
                            <div className="modalHeaderImage" style={{ backgroundImage: `url(${this.state.event.backgroundImage})` }}></div>
                            <div className="modalHeaderOverlay"></div>
                            <div className="modalTitle">
                                {this.state.event.title}
                            </div>
                        </div>
                    </div>

                </div>
                :
                ""
        );
    };
}