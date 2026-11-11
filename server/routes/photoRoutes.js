const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");
const upload = require("../middleware/upload");
const { validate, photoSchema } = require("../middleware/validation");
const { getAll, getOne, create, remove } = require("../controllers/photoController");

// Turns multer errors (wrong type, too big) into clean 400 responses
const uploadSingle = (req, res, next) => {
  upload.single("photo")(req, res, (err) => {
    if (err) return res.status(400).json({ success: false, message: err.message });
    next();
  });
};

router.get("/", getAll);
router.get("/:id", getOne);
router.post("/", auth, uploadSingle, validate(photoSchema), create);
router.delete("/:id", auth, remove);
router.use("/:id/comments", require("./commentRoutes.js"));

module.exports = router;