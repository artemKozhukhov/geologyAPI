const mongoose = require('mongoose');
const WellSchema = require('../MongoSchemes/WellSchema');
const Well = mongoose.model('Well', WellSchema);
module.exports = Well;
