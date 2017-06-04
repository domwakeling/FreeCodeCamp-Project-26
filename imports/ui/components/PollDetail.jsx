import React from 'react';
import PropTypes from 'prop-types';
import { Session } from 'meteor/session';
import { Meteor } from 'meteor/meteor';
import { _ } from 'underscore';

export default class PollDetailView extends React.Component {

    // Helper function to confirm whether user has voted
    hasVoted() {
        // if someone is logged in ...
        if (Meteor.user()) {
            // get the user id and check if they're in 'voters' array
            const user = Meteor.userId();
            return _.contains(this.props.poll.voters, user);

        // otherwise, check if there's a session ...
        } else if (Session.get('votedOn')) {
            const votedOn = Session.get('votedOn');
            return _.contains(votedOn, this.props.poll._id);

        // otherwise, no session info so return false
        } else {
            return false;
        }
    }

    // This is a temporary fix
    renderOptions() {
        return this.props.poll.options.map((option, idx) => {
            return (
                <p key={idx}>{option}: {this.props.poll.votesCount[idx]}</p>
            );
        });
    }

    renderView() {
        if (this.hasVoted()) {
            return this.renderOptions();
        } else {
            return (<p>NEED TO DEAL WITH VOTING</p>);
        }
    }

    render() {
        return (
            <div>
                <h3>{this.props.poll.subject}</h3>
                {this.renderView()}
            </div>
        );
    }
}

// Prevent eslint error report by declaring props
PollDetailView.propTypes = {
    poll: PropTypes.object.isRequired
};
