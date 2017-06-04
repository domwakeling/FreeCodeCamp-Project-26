import React from 'react';
import PropTypes from 'prop-types';

export default class PollDetailVote extends React.Component {

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

    render() {
        return (
            <form>
                {this.renderRadio()}
            </form>
        );
    }
}

PollDetailVote.propTypes = {
    poll: PropTypes.object.isRequired
};
