import React from 'react';
import PropTypes from 'prop-types';
import Layout from './components/Layout.jsx';
import { createContainer } from 'meteor/react-meteor-data';
import { Meteor } from 'meteor/meteor';
import { Polls } from '../api/polls.js';
import PollListItem from './components/PollListItem.jsx';
import NewPoll from './components/NewPoll.jsx';

class IndexPage extends React.Component {

    constructor(props) {
        super(props);
        this.state = { entryPoint: 'index' };
        this.newPoll = this.newPoll.bind(this);
        this.cancelPoll = this.cancelPoll.bind(this);
    }

    renderPoll() {
        return this.props.polls.map((poll) => (
            <PollListItem key={poll._id} poll={poll} />
        ));
    }

    newPoll() {
        this.setState({
            entryPoint: 'add'
        });
    }

    cancelPoll() {
        this.setState({
            entryPoint: 'index'
        });
    }

    renderMinor() {
        switch (this.state.entryPoint) {
            case 'index':
                return this.props.user ?
                    <button
                        className='main-button'
                        onClick={this.newPoll}
                        >
                        Make new poll
                    </button> :
                    <p>Not logged in</p>;
            default:
                return '';
        }
    }

    renderMajor() {
        // switch (this.props.location.pathname) {
        switch (this.state.entryPoint) {
            case 'index':
                return (this.renderPoll() );
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

IndexPage.propTypes = {
    polls: PropTypes.array.isRequired,
    user: PropTypes.object
};

export default createContainer(() => {
    return {
        polls: Polls.find({}).fetch(),
        user: Meteor.user()
    };
}, IndexPage);
