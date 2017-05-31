import React from 'react';
import Navbar from './Navbar.jsx';

export default class Layout extends React.Component {
    render() {
        return (
            <div>
                <Navbar />
                <div className='container'>
                    {this.props.children}
                </div>
            </div>
        );
    }
}
