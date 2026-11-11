const mongoose = require("mongoose");
const Photo = require("../models/Photo");
const Comment = require("../models/Comment");

exports.create = async (req, res, next) => {
  try {
    const { id } = req.params; // photo id from /api/photos/:id/comments

    if (!mongoose.isValidObjectId(id)) {
      return res.status(400).json({ success: false, message: "Invalid photo id" });
    }

    const photo = await Photo.findById(id);
    if (!photo) {
      return res.status(404).json({ success: false, message: "Photo not found" });
    }

    const created = await Comment.create({
      photoId: id,
      userId: req.userId,
      comment: req.body.comment,
    });

    const comment = await created.populate("userId", "firstName lastName");

    res.status(201).json({ success: true, comment });
  } catch (err) {
    next(err);
  }
};