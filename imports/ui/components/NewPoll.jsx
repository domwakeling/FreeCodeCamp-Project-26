import React from 'react';
import NewPollOption from './NewPollOption.jsx';

export default class NewPoll extends React.Component {

    // Set state and bind functions
    constructor(props) {
        super(props);
        this.state = {
            options: ['', '']
        };
        this.removeOption = this.removeOption.bind(this);
        this.addOption = this.addOption.bind(this);
        this.reportUpdate = this.reportUpdate.bind(this);
    }

    // Passed to NewPollOption children as a callback so changing their
    // inputs is called back to the NewPoll's state
    reportUpdate(newText, idx) {
        var currOptions = this.state.options;
        currOptions[idx] = newText;
        this.setState({
            options: currOptions
        });
    }

    // Passed to NewPollOption children as a callback so clicking on the
    // delete button removes options; passes back 'idx' proprety, which is
    // seeded with the index of that option in this.state.options
    removeOption(idx) {
        var currOptions = this.state.options;
        if (idx >= 0 && idx < currOptions.length) {
            currOptions.splice(idx, 1);
        }
        this.setState({
            options: currOptions
        });
    }

    // Handler for the 'add' button to push a new option into this.state.options
    addOption() {
        var currOptions = this.state.options;
        currOptions.push('');
        this.setState({
            options: currOptions
        });
    }

    // Iterate through this.state.options (using map) to create a NewPollOption
    // component. Use const before the return because otherwise updating the
    // state will NOT cause the NewPollOption to re-render if an option is
    // deleted. Use the index for key (has to be unique) and ALSO pass as 'id'
    // because the key is not exposed for use.
    renderOptions() {
        return this.state.options.map( (option, idx) => {
            const optionText = option;
            return (
                <NewPollOption
                    delFunction={this.removeOption}
                    id={idx}
                    key={idx}
                    optionText={optionText}
                    reportUpdate={this.boundReportUpdate}
                />
            );
        });
    }

    render() {
        // bind because it's being passed for callback (actually called in
        // renderOptions)
        this.boundReportUpdate = this.reportUpdate.bind();

        // This looks a little messy but is actually rendering:
        // - a header 'New Poll'
        // - a poll name input + label
        // - an 'options' label + the options via renderOptions function
        // - an 'add' button to add new (blank) options
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
                        className='round-button add-button'
                        onClick={this.addOption}
                        >+</button>
                </div>
                <div className='input-container'>
                    {this.renderOptions()}
                </div>

                <div className='clearfix' />
                <br />

            </div>
        );
    }
}
