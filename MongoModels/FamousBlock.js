const mongoose = require('mongoose');
const FamousBlockSchema = require('../MongoSchemes/FamousBlock');

module.exports = mongoose.model('FamousBlock', FamousBlockSchema);
