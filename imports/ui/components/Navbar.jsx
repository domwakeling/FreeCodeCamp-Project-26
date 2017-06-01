import React from 'react';
import MenuItems from './Menu.jsx';

export default class Navbar extends React.Component {

    // make the menu button work
    clickHandler() {
        $('.navbar-collapse').slideToggle(200);
        $('.menu-toggle-button').blur();
    }

    render() {
        return (
            <div>
                <div className='mast-head'>

                    <div className='container'>
                        <div className='brand'>
                            <a href='/'>FCC26 Polling App</a>
                        </div>

                        <button
                            className='menu-toggle-button'
                            onClick={this.clickHandler.bind(this)}
                            >
                            <div className='icon-bar' />
                            <div className='icon-bar' />
                            <div className='icon-bar' />
                        </button>

                        <div className='navbar-top-menu' id='navbar-top-menu'>
                            <MenuItems />
                        </div>

                    </div>

                    <div className='navbar-collapse' id='navbar-toggle-menu'>

                        <div className='container' id='menu-copy'>
                            <MenuItems />
                        </div>

                    </div>

                </div>

                <div id='head-space' />
            </div>
        );
    }
}
