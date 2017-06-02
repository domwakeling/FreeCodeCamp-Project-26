import React from 'react';
import PropTypes from 'prop-types';

// Poll component - represents single poll
export default class PollListItem extends React.Component {
    render() {
        return (
            <div>this.props.poll</div>
        );
    }
}

PollListItem.propTypes = {
    poll: PropTypes.object.isRequired
};
