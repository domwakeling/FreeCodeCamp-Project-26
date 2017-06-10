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
            selectedPoll: '',
            filter: false
        };
        this.newPoll = this.newPoll.bind(this);
        this.cancelPoll = this.cancelPoll.bind(this);
        this.deletePoll = this.deletePoll.bind(this);
        this.filterSwitch = this.filterSwitch.bind(this);
    }

    // if the path is /poll/{17-char-id} and we're not in detail, call helper
    componentDidUpdate() {
        const currSt = this.state;
        if (currSt.entryPoint !== 'detail' || currSt.selectedPoll === '') {
            if (/^\/poll\/\w{17}$/.test(this.props.location.pathname)) {
                this.viewPollUsingRoute(this.props.location.pathname);
            }
        }
    }

    // try to extract a pollId from route and if valid, change state
    viewPollUsingRoute(route) {
        const pollId = route.match(/^\/poll\/(\w{17})$/)[1];
        if (Polls.findOne( {_id: pollId} ) ) {
            this.setState({
                entryPoint: 'detail',
                selectedPoll: pollId
            });
        } else {
            console.log('Invalid route: no poll with _id', pollId);
        }
    }

    // Helper function checking if there's an active poll owned by user
    activePollByUser() {
        if (this.state.selectedPoll !== '' && Meteor.user()) {
            const pollId = this.state.selectedPoll;
            const currentPoll = Polls.findOne( {_id: pollId} );
            if (currentPoll) {
                return currentPoll.createdBy === Meteor.userId();
            } else {
                return false;
            }
        } else {
            return false;
        }
    }

    // Helper function to switch state of filter
    filterSwitch() {
        const filtered = this.state.filter;
        this.setState( {filter: !filtered} );
    }

    // Handler passed to NewPoll as callback to deal with cancelling the poll;
    cancelPoll() {
        this.setState({
            entryPoint: 'index',
            selectedPoll: ''
        });
        if (this.props.location.pathname !== '/') {
            this.props.history.push('/');
        }
    }

    // Handler passed to NewPoll as callback, to deal with saving the poll;
    createPoll(subject, options) {
        Meteor.call('polls.newPoll', subject, options);
        this.setState({
            entryPoint: 'index',
            selectedPoll: ''
        });
    }

    deletePoll() {
        const pollId = this.state.selectedPoll;
        this.setState({
            entryPoint: 'index',
            selectedPoll: ''
        });
        if (this.props.location.pathname !== '/') {
            this.props.history.push('/');
        }
        Meteor.call('polls.deletePoll', pollId);
    }

    // Handler for 'new poll' button - changes state to 'add', render() acts
    newPoll() {
        this.setState({
            entryPoint: 'add',
            selectedPoll: ''
        });
    }

    // Handler passed to PollListItem as callback when user selects poll
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

    // Render the poll names in a list of PollListItem components
    renderPollList() {
        this.boundSelectPoll = this.selectPollFromList.bind(this);
        // set the props being shown based on filter status
        var pollsToShow = this.state.filter ?
            this.props.polls.filter((poll) =>
                poll.createdBy === Meteor.userId()
            ) :
            this.props.polls;
        // return this.props.polls.map((poll) => (
        return pollsToShow.map((poll) => (
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
                var filteredText = this.state.filter ? 'all' : 'your';
                return this.props.user ?
                    <div>
                        <button className='main-button'
                                onClick={this.newPoll}
                                >
                            Make new poll
                        </button>
                        <div className='clearfix' />
                        <button
                            className='main-button space-top'
                            onClick={this.filterSwitch}
                            >
                            Show {filteredText} polls
                        </button>
                    </div> :
                    <p>Not logged in</p>;

            case 'detail':
                var showDelete = this.activePollByUser();
                return (
                    <div>
                        <button className='main-button'
                                onClick={this.cancelPoll}
                                >
                            Back
                        </button>
                        { showDelete ?
                            <div>
                                <div className='clearfix' />
                                <button
                                    className='main-button btn-cancel space-top'
                                    onClick={this.deletePoll}
                                    >
                                    Delete poll
                                </button>
                            </div> : ''
                        }
                    </div>
                );

            // default to empty
            default:
                return '';
        }
    }

    // Helper function to control what is rendered in the 'container-major'
    renderMajor() {

        switch (this.state.entryPoint) {

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

            default:
                return (
                    <div>
                        <h4>Select a poll to vote and see results</h4>
                        {this.renderPollList() }
                    </div>);
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
    history: PropTypes.object,
    location: PropTypes.object,
    polls: PropTypes.array.isRequired,
    user: PropTypes.object
};

// Wrap the component in a createContainer component, so data can be rendered
export default createContainer(() => {
    Meteor.subscribe('polls');
    return {
        polls: Polls.find({}).fetch(),
        user: Meteor.user()
    };
}, IndexPage);
