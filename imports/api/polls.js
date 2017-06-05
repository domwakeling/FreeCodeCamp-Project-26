import { Meteor } from 'meteor/meteor';
import { Mongo } from 'meteor/mongo';

export const Polls = new Mongo.Collection('polls');

Meteor.methods({

    'polls.addOption'(pollId, text) {

        Polls.update(pollId,
            {$addToSet: {options: text}},
        );
        Polls.update(pollId,
            {$push: {votesCount: {$each: [0]}}}
        );
    }
});
