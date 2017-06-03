import React from 'react';
// import PropTypes from 'prop-types';
// import { createContainer } from 'meteor/react-meteor-data';
import NewPollOption from './NewPollOption.jsx';

export default class NewPoll extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            options: ['', '']
        };
        this.removeOption = this.removeOption.bind(this);
        this.addOption = this.addOption.bind(this);
    }

    fakeRender() {
        return this.state.options.map( (option, idx) => {
            return (idx > 0 ? ', ' : '' ) + idx + ' ' + option;
        }, '');
    }

    removeOption(idx) {
        var currOptions = this.state.options;
        if (idx >= 0 && idx < currOptions.length) {
            currOptions.splice(idx, 1);
        }
        this.setState({
            options: currOptions
        });
    }

    addOption() {
        var currOptions = this.state.options;
        currOptions.push('');
        this.setState({
            options: currOptions
        });
    }

    renderOptions() {
        return this.state.options.map( (option, idx) => {
            return (
                <NewPollOption
                    delFunction={this.removeOption}
                    id={idx}
                    key={idx}
                    optionText={option}
                />
            );
        });
    }

    render() {

        return (
            <div>
                <h3 className='poll-header'>New Poll</h3>

                <div className='input-label'>Subject</div>
                <div className='input-container'>
                    <input className='input-text'name='pSubject' type='text'/>
                </div>
                <div className='clearfix' />
                <br />

                <div className='input-label'>
                    <p>Options</p>
                    <button
                        className='round-button'
                        onClick={this.addOption}
                        >+</button>
                </div>
                <div className='input-container'>
                    {this.renderOptions()}
                </div>

                <div className='clearfix' />
                <br />

                <div>Current state {this.fakeRender()}</div>

            </div>
        );
    }
}

// NewPoll.propTypes = {
//     options: PropTypes.array.isRequired
// };
//
// export default createContainer(() => {
//     return {
//         options: ['', '']
//     };
// }, NewPoll);
