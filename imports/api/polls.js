import { Meteor } from 'meteor/meteor';
import { Mongo } from 'meteor/mongo';

export const Polls = new Mongo.Collection('polls');

Meteor.methods({

    'polls.newPoll'(subject, options) {
        const counts = options.map(() => 0);
        Polls.insert({
            createdBy: Meteor.userId(),
            subject: subject,
            options: options,
            votesCount: counts,
            voters: []
        });
    },

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

        // if there's a logged-in user, add their ID ...
        if (Meteor.user()) {
            Polls.update(pollId, { $addToSet: { voters: Meteor.userId() } });
        }
    }

});
