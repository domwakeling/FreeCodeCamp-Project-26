import React from 'react';

export default class NewPoll extends React.Component {
    render() {
        return (
            <div>
                <h3 className='poll-header'>New Poll</h3>
                <div>
                    <span className='labelSpan'>Subject:</span>
                    <span className='wrapSpan'>
                        <input className='textSpan' name='' type='text' />
                    </span>
                </div>
            </div>
        );
    }
}
