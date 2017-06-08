import React from 'react';
import PropTypes from 'prop-types';

// Represents a poll in the 'list of polls' screen; shows the name
export default class PollListItem extends React.Component {

    constructor(props) {
        super(props);
        this.pollSelected = this.pollSelected.bind(this);
    }

    pollSelected() {
        this.props.selectCallback(this.props.poll._id);
    }

    render() {
        return (
            <button
                className='poll-button'
                onClick={this.pollSelected}
                >
                {this.props.poll.subject}
            </button>
        );
    }
}

// Prevent eslint error report by declaring props
PollListItem.propTypes = {
    poll: PropTypes.object.isRequired,
    selectCallback: PropTypes.func
};
