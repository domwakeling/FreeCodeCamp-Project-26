import React from 'react';
import PropTypes from 'prop-types';
import Layout from './components/Layout.jsx';
import { createContainer } from 'meteor/react-meteor-data';
import { Meteor } from 'meteor/meteor';
import { Polls } from '../api/polls.js';
import PollListItem from './components/PollListItem.jsx';
import NewPoll from './components/NewPoll.jsx';
import { Bert } from 'meteor/themeteorchef:bert';
import PollDetailView from './components/PollDetail.jsx';
import { _ } from 'underscore';

// Main index page
class IndexPage extends React.Component {

    // Constructor to set state and bind functions
    constructor(props) {
        super(props);
        this.state = {
            entryPoint: 'index',
            selectedPoll: ''
        };
        this.newPoll = this.newPoll.bind(this);
        this.cancelPoll = this.cancelPoll.bind(this);
    }

    // Handler passed to NewPoll as callback to deal with cancelling the poll;
    // changes state to 'index', render() acts
    cancelPoll() {
        this.setState({
            entryPoint: 'index',
            selectedPoll: ''
        });
    }

    // Handler passed to NewPoll as callback, to deal with saving the poll;
    // add object to collection and change this.state.entryPoint to 'index'
    createPoll(subject, options) {
        const counts = options.map(() => 0);
        Polls.insert({
            createdBy: Meteor.userId(),
            subject: subject,
            options: options,
            votesCount: counts,
            voters: []
        });

        this.setState({
            entryPoint: 'index',
            selectedPoll: ''
        });
    }

    // Handler for 'new poll' button - changes state to 'add', render() acts
    newPoll() {
        this.setState({
            entryPoint: 'add',
            selectedPoll: ''
        });
    }

    // Handler passed to PollListItem as callback, to deal with user selection
    // of a poll - sets state for selected poll ref and sets view state
    selectPollFromList(pollId) {
        const selectedPoll = _.find(this.props.polls, {_id: pollId} );
        if (selectedPoll !== null) {
            this.setState({
                entryPoint: 'detail',
                selectedPoll: pollId
            });
        } else {
            Bert.alert({
                title: 'ERROR',
                type: 'danger',
                message: 'Unable to select poll',
                style: 'growl-top-right',
                icon: 'fa-warning'
            });
        }
    }

    // Iterate through the polls property (linked to collection) to render
    // them in summary state, called in renderMajor()
    renderPollList() {
        this.boundSelectPoll = this.selectPollFromList.bind(this);
        return this.props.polls.map((poll) => (
            <PollListItem
                key={poll._id}
                poll={poll}
                selectCallback={this.boundSelectPoll}
            />
        ));
    }

    // Check that we have a valid poll selected and if so render it
    renderPollDetail() {
        // note that this is passing an **ID**
        if (this.state.selectedPoll !== '') {
            return (
                <PollDetailView pollId={this.state.selectedPoll}/>
            );
        } else {
            return <div />;
        }
    }

    // Helper function to control what is rendered in the 'container-minor'
    renderMinor() {

        switch (this.state.entryPoint) {

            // if 'index', we want 'Make new poll' if user signed in
            case 'index':
                return this.props.user ?
                    <button
                        className='main-button'
                        onClick={this.newPoll}
                        >
                        Make new poll
                    </button> :
                    <p>Not logged in</p>;

            case 'detail':
                return (
                    <button
                        className='main-button'
                        onClick={this.cancelPoll}
                        >
                        Back
                    </button>
                );

            // default to empty
            default:
                return '';
        }
    }

    // Helper function to control what is rendered in the 'container-major'
    renderMajor() {

        switch (this.state.entryPoint) {

            // if 'add' show NewPoll to create a new poll
            case 'add':
                this.boundCreatePoll = this.createPoll.bind(this);
                this.boundCancelPoll = this.cancelPoll.bind(this);
                return (
                    <div>
                        <NewPoll
                            cancelCallback={this.boundCancelPoll}
                            createPollCallback={this.boundCreatePoll}
                        />
                    </div>
                );

            case 'detail':
                return (this.renderPollDetail() );

            // default to showing the list of polls(= 'index')
            default:
                return (this.renderPollList() );
        }

    }

    // Render main part of app; this calls helper functions which do the work
    render() {
        return (
            <Layout>
                <div className='container-minor'>
                    { this.renderMinor() }
                </div>
                <div className='container-major'>
                    { this.renderMajor() }
                </div>
            </Layout>
        );
    }
}

// Define props types, error checking and prevents eslint error reports
IndexPage.propTypes = {
    polls: PropTypes.array.isRequired,
    user: PropTypes.object
};

// Wrap the component in a createContainer component, in order that data can
// be rendered
export default createContainer(() => {
    return {
        polls: Polls.find({}).fetch(),
        user: Meteor.user()
    };
}, IndexPage);
