import React from 'react';
import PropTypes from 'prop-types';
import { Session } from 'meteor/session';
import { Meteor } from 'meteor/meteor';
import { _ } from 'underscore';
import { createContainer } from 'meteor/react-meteor-data';
import { Polls } from '../../api/polls.js';
import PollDetailVote from './PollDetailVote.jsx';
// import { Bert } from 'meteor/themeteorchef:bert';

class PollDetailView extends React.Component {

    // Helper function to confirm whether current user has voted
    hasVoted() {
        const poll = _.find(this.props.polls, {_id: this.props.pollId});
        // if someone is logged in ...
        if (this.props.user) {
            // get the user id and check if they're in 'voters' array
            const user = Meteor.userId();
            return _.contains(poll.voters, user);

        // otherwise, check if there's a session ...
        } else if (Session.get('votedOn')) {
            const votedOn = Session.get('votedOn');
            return _.contains(votedOn, this.props.pollId);

        // otherwise, no session info so return false
        } else {
            return false;
        }
    }

    // Callback function to deal with a new optoin being added in voted
    addOptionFromVote(newOption) {
        // newOption blank *should* be caught in PollDetailVote, but ...
        if (newOption !== '') {
            Meteor.call('polls.addOption', this.props.pollId, newOption);
            console.log('May have worked?');
        }
    }

    // This is a temporary fix
    // TODO: write the data visualisation properly!
    renderVisualisation() {
        const poll = _.find(this.props.polls, {_id: this.props.pollId});
        return poll.options.map((option, idx) => {
            return (
                <p key={idx}>{option}: {poll.votesCount[idx]}</p>
            );
        });
    }

    // Render the poll voting view
    renderVoting(poll) {
        return (
            <PollDetailVote
                addCallback={this.boundAddOptionFromVote}
                poll={poll}
            />
        );
    }

    // Render the detailed view (visualisation or vote)
    renderView(poll) {
        if (this.hasVoted()) {
            return this.renderVisualisation();
        } else {
            return this.renderVoting(poll);
        }
    }

    // Show subject and call a visualisastion
    render() {
        const poll = _.find(this.props.polls, {_id: this.props.pollId});
        this.boundAddOptionFromVote = this.addOptionFromVote.bind(this);
        return (
            <div>
                <h3>{poll.subject}</h3>
                {this.renderView(poll)}
            </div>
        );
    }
}

// Prevent eslint error report by declaring props
PollDetailView.propTypes = {
    pollId: PropTypes.string.isRequired,
    polls: PropTypes.array.isRequired,
    user: PropTypes.object
};

export default createContainer(() => {
    return {
        polls: Polls.find({}).fetch(),
        user: Meteor.user()
    };
}, PollDetailView);
