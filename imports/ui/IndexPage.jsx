import React from 'react';
import PropTypes from 'prop-types';
import Layout from './components/Layout.jsx';
import { createContainer } from 'meteor/react-meteor-data';
import { Meteor } from 'meteor/meteor';

class IndexPage extends React.Component {

    render() {
        return (
            <Layout>
                <p>This might actually be working</p>
                { this.props.user ?
                    <p>{this.props.user._id}</p> :
                    <p>No user</p>
                }
            </Layout>
        );
    }
}

IndexPage.propTypes = {
   user: PropTypes.object
};

export default createContainer(() => {
    return {
        user: Meteor.user()
    };
}, IndexPage);
