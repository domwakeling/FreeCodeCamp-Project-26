import React from 'react';
import PropTypes from 'prop-types';
import Layout from './components/Layout.jsx';
import { createContainer } from 'meteor/react-meteor-data';
import { Meteor } from 'meteor/meteor';
import { Polls } from '../api/polls.js';
import PollListItem from './components/PollListItem.jsx';
import NewPoll from './components/NewPoll.jsx';

// Main index page
class IndexPage extends React.Component {

    // Constructor to set state and bind functions
    constructor(props) {
        super(props);
        this.state = { entryPoint: 'index' };
        this.newPoll = this.newPoll.bind(this);
        this.cancelPoll = this.cancelPoll.bind(this);
    }

    // Iterate through the polls property (linked to collection) to render
    // them in summary state
    renderPoll() {
        return this.props.polls.map((poll) => (
            <PollListItem key={poll._id} poll={poll} />
        ));
    }

    // Handler for 'new poll' button pressed - changes this.state.entryPoint to
    // 'add' which causes the NewPoll component to be rendered through the
    // logic in render() and helper functions
    newPoll() {
        this.setState({
            entryPoint: 'add'
        });
    }

    // Handler for 'cancel' button pressed - changes this.state.entryPoint
    // to 'index' which will cause poll to disappear through logic in render()
    cancelPoll() {
        this.setState({
            entryPoint: 'index'
        });
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

            // default to empty
            default:
                return '';
        }
    }

    // Helper function to control what is rendered in the 'container-major'
    renderMajor() {

        switch (this.state.entryPoint) {

            // if 'index' render list of polls
            case 'index':
                return (this.renderPoll() );

            // default to showing a NewPoll
            // TODO: change this once logic completed, should default to list?
            default:
                return (
                    <div>
                        <NewPoll />
                        <button
                            className='main-button btn-right btn-cancel'
                            onClick={this.cancelPoll}
                            >
                            Cancel
                        </button>
                        <button
                            className='main-button btn-right'
                            >
                            Save poll
                        </button>
                    </div>
                );
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
