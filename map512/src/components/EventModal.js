import React, { Component } from 'react';

export class EventModal extends Component {
    constructor(props) {
        super(props);
    }
    render() {
        return (
            <div className="modalWrapper">
                <div className="modalContainer" style={{width: `${this.props.width}`, height: `${this.props.height}`}}>
                    <div class="modalHeader" style={{ backgroundImage: `url(${this.props.event.backgroundImage})` }}>
                        <div class="modalHeaderOverlay"></div>
                        <div class="modalTitle">
                            {this.props.event.title}
                        </div>
                    </div>
                </div>
            </div>
        );
    };
}