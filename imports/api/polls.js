import { Meteor } from 'meteor/meteor';
import { Mongo } from 'meteor/mongo';
import { Session } from 'meteor/session';

export const Polls = new Mongo.Collection('polls');

Meteor.methods({

    'polls.addOption'(pollId, text) {

        Polls.update(pollId,
            {$addToSet: {options: text}},
        );
        Polls.update(pollId,
            {$push: {votesCount: {$each: [0]}}}
        );
    },

    'polls.saveVote'(pollId, chosenIndex) {
        // update the count
        var incModifier = { $inc: {} };
        incModifier.$inc['votesCount.' + chosenIndex] = 1;
        Polls.update(pollId, incModifier);

        // if there's a logged-in user, add ...
        if (Meteor.user()) {
            Polls.update(pollId, { $addToSet: { voters: Meteor.userId() } });
        }
    }

});
