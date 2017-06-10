import React from 'react';
import PropTypes from 'prop-types';
import { Session } from 'meteor/session';
import { Meteor } from 'meteor/meteor';
import { _ } from 'underscore';
import { createContainer } from 'meteor/react-meteor-data';
import { Polls } from '../../api/polls.js';
import PollDetailVote from './PollDetailVote.jsx';
import PollChart from './PollChartView.jsx';

class PollDetailView extends React.Component {

    // Helper function to confirm whether current user has voted
    hasVoted() {
        const poll = _.find(this.props.polls, {_id: this.props.pollId});
        // if someone is logged in ...
        if (this.props.user) {
            // if there's a user get ID and check if they're in 'voters' array
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

    // Callback function to deal with a new option being added in vote
    addOptionFromVote(newOption) {
        // newOption blank *should* be caught in PollDetailVote, but ...
        if (newOption !== '') {
            Meteor.call('polls.addOption', this.props.pollId, newOption);
        }
    }

    // Callback function to deal with an option being voted on
    addVoteFromVote(chosenIndex) {
        // undefined index *should* be caught in PollDetailVote, but ...
        if (chosenIndex) {
            Meteor.call('polls.saveVote', this.props.pollId, chosenIndex);
            if (!Meteor.user()) {
                if (Session.get('votedOn')) {
                    let votedOn = Session.get('votedOn');
                    votedOn.push(this.props.pollId);
                    Session.set('votedOn', votedOn);
                } else {
                    Session.set('votedOn', [this.props.pollId]);
                }
            }
        }
    }

    showLink() {
        $('#pollLink').toggle(150);
    }

    // Render data visualisation of poll
    renderVisualisation() {
        const poll = _.find(this.props.polls, {_id: this.props.pollId});
        // return poll.options.map((option, idx) => {
            // return (
        return (
            <PollChart
                labels={poll.options}
                scores={poll.votesCount}
            />
                // {/* <p key={idx}>{option}: {poll.votesCount[idx]}</p> */}
            // );
        // });
        );
    }

    // Render the poll voting view, called inside renderView
    renderVoting(poll) {
        return (
            <PollDetailVote
                addCallback={this.boundAddOptionFromVote}
                poll={poll}
                saveCallback={this.boundAddVoteFromVote}
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
        const rootUrl = Meteor.absoluteUrl();
        const fullUrl = rootUrl + 'poll/' + poll._id;
        this.boundAddOptionFromVote = this.addOptionFromVote.bind(this);
        this.boundAddVoteFromVote = this.addVoteFromVote.bind(this);
        this.boundShowLink = this.showLink.bind(this);
        return (
            <div>
                <div className='pollTitle'>
                    {poll.subject}
                    <i className='fa fa-link float-right'
                        onClick={this.boundShowLink}
                    />
                </div>
                <div id='pollLink'>
                    Copy this address to share :&nbsp;
                    <span className='urlLink'>{fullUrl}</span>
                </div>
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
