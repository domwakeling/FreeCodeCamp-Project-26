import React from 'react';
import PropTypes from 'prop-types';
import Layout from './components/Layout.jsx';
import { createContainer } from 'meteor/react-meteor-data';
import { Meteor } from 'meteor/meteor';

class IndexPage extends React.Component {

    render() {
        return (
            <Layout>
                { this.props.user ?
                    <button className='main-button'>Make new poll</button> :
                    ''
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
