const CodeSchema = require('../MongoSchemes/Code');
const mongoose = require('mongoose');

const Code = mongoose.model('Code', CodeSchema);
module.exports = Code;
