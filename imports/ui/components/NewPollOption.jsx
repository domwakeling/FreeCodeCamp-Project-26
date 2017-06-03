import React from 'react';

export default class NewPollOption extends React.Component {

    constructor(props) {
        super(props);
    }

    deleteHandler() {
        this.props.delFunction(this.props.id);
    }

    render() {
        this.boundDeleteHandler = this.deleteHandler.bind(this);
        return (
            <div className='poll-option'>
                <input className='input-text' name='pSubject' type='text'/>
                <button
                    className='round-button btn-cancel'
                    onClick={this.boundDeleteHandler}
                    >&times;</button>
            </div>
        );
    }
}
