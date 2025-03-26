const mongoose = require('mongoose');

let teamSchema = new mongoose.Schema({
    pictures: [{type: String, required: true}], // Array of URLs or paths to the pictures
    names: {
        en: {type: String, required: true}, // English name
        ru: {type: String, required: true} // Name in other language
    },
    descriptions: {
        en: {type: String, required: true}, // English description
        ru: {type: String, required: true} // Description in other language
    },
    players: [{type: String, required: true}], // Array of player names
    coach: {type: String, required: true}, // Coach's name
    deletedAt: {type: Date}
}, {timestamps: true});

// Ensure there are exactly three pictures
teamSchema.path('pictures').validate(function(value) {
    return value.length === 3;
}, 'There must be exactly three pictures.');

// Ensure there are six or fewer players
teamSchema.path('players').validate(function(value) {
    return value.length <= 6;
}, 'There must be six or fewer players.');

const Team = mongoose.model("Teams", teamSchema, 'teams');

module.exports = Team;