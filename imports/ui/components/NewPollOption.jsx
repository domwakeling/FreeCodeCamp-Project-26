import React from 'react';
import PropTypes from 'prop-types';

export default class NewPollOption extends React.Component {

    // Handler for 'delete' button clicked, sends the id (=index) of the
    // option back to parent NewPoll via delFunction prop
    deleteHandler() {
        this.props.delFunction(this.props.id);
    }

    // Handler for change, passes the revised text + id (=index) back to the
    // parent NewPoll (which will change state and therefore prop of this
    // component)
    changeHandler(e) {
        this.props.reportUpdate(e.target.value, this.props.id);
    }

    render() {

        // Bind handlers; store the passed 'optionText' prop in a const so that
        // changes render properly, particularly when deleting an option
        this.boundDeleteHandler = this.deleteHandler.bind(this);
        this.boundChangeHandler = this.changeHandler.bind(this);
        const currentText = this.props.optionText;

        // Render input and delete button
        return (
            <div className='poll-option'>
                <input
                    className='input-text'
                    onChange={this.boundChangeHandler}
                    type='text'
                    value={currentText}
                />
                <button
                    className='round-button btn-cancel'
                    onClick={this.boundDeleteHandler}
                    >&times;</button>
            </div>
        );
    }
}

// Prevent eslint error report by declaring props
NewPollOption.propTypes = {
    delFunction: PropTypes.func,
    id: PropTypes.number,
    optionText: PropTypes.string,
    reportUpdate: PropTypes.func
};
