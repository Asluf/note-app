var mongoose = require("mongoose");
require("dotenv").config();

const SALT = 10;
var Schema = mongoose.Schema;
var NoteSchema = new Schema({
  title: {
    type: String,
    required: [true, "Title field is required!"],
    maxlength: 100,
  },
  content: {
    type: String,
    required: [true, "Content field is  required!"],
    maxlength: 1000,
  },
  isFavorite: {
    type: Boolean,
    maxlength: 100,
    default: false,
  },
  updated_at: {
    type: Date,
    default: Date.now()
  }
});

const Note = mongoose.model("note_lists", NoteSchema);
module.exports = { Note };