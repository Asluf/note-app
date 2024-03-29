const { Note } = require("../models/NoteModel");

exports.getSearchNote = (req, res) => {
  const { title } = req.query;

  const filter = title
    ? {
      $or: [
        { title: { $regex: new RegExp(title, "i") } },
        { content: { $regex: new RegExp(title, "i") } }
      ]
    }
    : {};

  Note.find(filter)
    .then((data) => {
      if (!data) {
        return res
          .status(404)
          .json({ success: false, message: "Note not found!" });
      } else {
        return res.status(200).json({
          success: true,
          message: "Note found",
          data: data,
        });
      }
    })
    .catch((err) => {
      return res.status(500).json({
        success: false,
        message: "Something went wrong",
        data: err,
      });
    });
};

exports.getAllNote = async (req, res) => {
  const favoriteNote = await Note.find({ isFavorite: true });
  const allNote = await Note.find();


  if (!favoriteNote || !allNote) {
    return res.status(404).json({
      success: false,
      message: "Note not found!",
    });
  }

  return res.status(200).json({
    success: true,
    message: "Note found",
    favoriteNote: favoriteNote,
    allNote: allNote
  });
};

exports.createNote = (req, res) => {
  const x = new Note({
    title: req.body.title,
    content: req.body.content,
  });
  x.save()
    .then(() => {
      return res.status(200).json({
        success: true,
        message: "Note created successfully",
      });
    })
    .catch((err) => {
      return res.status(500).json({
        success: false,
        message: "Something went wrong",
        data: err,
      });
    });
};

exports.deleteNote = (req, res) => {
  const { noteId } = req.params;

  Note.findByIdAndRemove(noteId)
    .then((deletedNote) => {
      if (!deletedNote) {
        return res.status(404).json({
          success: false,
          message: "Note not found!",
        });
      }

      return res.status(200).json({
        success: true,
        message: "Note deleted successfully",
        data: deletedNote,
      });
    })
    .catch((err) => {
      return res.status(500).json({
        success: false,
        message: "Something went wrong",
        data: err,
      });
    });
};

exports.getOneNote = (req, res) => {
  Note.findOne({ _id: req.params.noteId })
    .then((data) => {
      if (!data) {
        return res
          .status(404)
          .json({ success: false, message: "Note not found!" });
      } else {
        return res.status(200).json({
          success: true,
          message: `Note found`,
          data: data,
        });
      }
    })
    .catch((err) => {
      return res.status(500).json({
        success: true,
        message: "Something went wrong",
        data: err,
      });
    });
};

exports.updateNote = (req, res) => {
  const updateData = {
    title: req.body.title,
    content: req.body.content,
    isFavorite: req.body.isFavorite,
  };

  Note.findOneAndUpdate(
    { _id: req.params.noteId },
    { $set: updateData },
    { new: true, useFindAndModify: false }
  )
    .then((data) => {
      if (!data) {
        return res.status(404).json({
          success: false,
          message: "Resource not found",
        });
      } else {
        return res.status(200).json({
          success: true,
          message: `Note is updated.`,
          data: data,
        });
      }
    })
    .catch((err) => {
      return res.status(500).json({
        success: true,
        message: "Something went wrong",
        data: err,
      });
    });
};

exports.handleFavorite = (req, res) => {
  const updateData = {
    isFavorite: !req.body.isFavorite,
  };

  Note.findOneAndUpdate(
    { _id: req.params.noteId },
    { $set: updateData },
    { new: true, useFindAndModify: false }
  )
    .then((data) => {
      if (!data) {
        return res.status(404).json({
          success: false,
          message: "Resource not found",
        });
      } else {
        return res.status(200).json({
          success: true,
          message: `Note is updated.`,
          data: data,
        });
      }
    })
    .catch((err) => {
      return res.status(500).json({
        success: true,
        message: "Something went wrong",
        data: err,
      });
    });
};