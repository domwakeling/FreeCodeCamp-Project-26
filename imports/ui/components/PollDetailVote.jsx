import React from 'react';
import PropTypes from 'prop-types';
import { Meteor } from 'meteor/meteor';
import { Bert } from 'meteor/themeteorchef:bert';

export default class PollDetailVote extends React.Component {

    constructor(props) {
        super(props);
        this.addOptionHandler = this.addOptionHandler.bind(this);
        this.saveOptionHandler = this.saveOptionHandler.bind(this);
    }

    renderRadio() {

        return this.props.poll.options.map((option, idx) => {

            return (
                <div className='radio' key={idx} >
                    <input
                        name='poll'
                        type='radio'
                        value={idx}
                    />
                    &nbsp;{option}
                </div>
            );
        });
    }

    addOptionHandler() {
        const newValue = $('#newPollOption')[0].value;
        if (newValue !== '') {
            $('#newPollOption').val('');
            this.props.addCallback(newValue);
        } else {
            Bert.alert({
                title: 'Empty option',
                type: 'danger',
                message: 'Can\'t add an empty option!',
                style: 'growl-top-right',
                icon: 'fa-warning'
            });
        }
    }

    saveOptionHandler() {
        const chosenOptionIndex = $( 'input[type=radio]:checked' ).val();
        if (chosenOptionIndex) {
            this.props.saveCallback(chosenOptionIndex);
        } else {
            Bert.alert({
                title: 'No option chosen',
                type: 'danger',
                message: 'Select an option before voting!',
                style: 'growl-top-right',
                icon: 'fa-warning'
            });
        }
    }

    render() {
        return (
            <div>
                <p>Please select from the following options</p>
                <form>
                    {this.renderRadio()}
                </form>
                <button
                    className='main-button'
                    onClick={this.saveOptionHandler}
                    >
                    Vote
                </button>
                { Meteor.user() ?
                    <div>
                        <br />
                        <p>Or add a new option</p>
                        <div className='poll-option'>
                            <input
                                className='input-text'
                                id='newPollOption'
                                type='text'
                            />
                        </div>
                        <button
                            className='main-button'
                            onClick={this.addOptionHandler}
                            >
                            Add
                        </button>
                    </div> : ''
                }
            </div>
        );
    }
}

PollDetailVote.propTypes = {
    addCallback: PropTypes.func,
    poll: PropTypes.object.isRequired,
    saveCallback: PropTypes.func
};
