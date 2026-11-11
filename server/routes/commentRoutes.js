const express = require("express");
const router = express.Router({ mergeParams: true }); // gives access to :id of the parent route
const auth = require("../middleware/auth");
const { validate, commentSchema } = require("../middleware/validation");
const { create } = require("../controllers/commentController");

router.post("/", auth, validate(commentSchema), create);

module.exports = router;