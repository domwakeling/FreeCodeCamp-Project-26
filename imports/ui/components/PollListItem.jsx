import React from 'react';
import PropTypes from 'prop-types';

// Represents a poll in the 'list of polls' screen; shows the name
// TODO: make this work
export default class PollListItem extends React.Component {
    render() {
        return (
            <div>this.props.poll</div>
        );
    }
}

// Prevent eslint error report by declaring props
PollListItem.propTypes = {
    poll: PropTypes.object.isRequired
};
