import React from 'react';
import AccountsUIWrapper from './AccountsWrapper.jsx';

export default class MenuItems extends React.Component {
    render() {
        return (
            <ul>
                <li><a href='#'>Home</a></li>
                <li><a href='#'>Map</a></li>
                <li><AccountsUIWrapper /></li>
            </ul>
        );
    }
}
