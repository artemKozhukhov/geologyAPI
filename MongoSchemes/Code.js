const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const CodeSchema = new Schema(
  {
    deposit: {
      type: Schema.Types.ObjectId,
      required: true,
    },
    name: {
      type: Schema.Types.String,
      required: true,
    },
    index: {
      type: Schema.Types.Number,
      required: true,
    },
    color: {
      type: Schema.Types.String,
        require: true,
    }
  },
  { versionKey: false },
);

module.exports = CodeSchema;
