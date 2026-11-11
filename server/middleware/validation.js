const fs = require("fs");
const Joi = require("joi");

const registerSchema = Joi.object({
  firstName: Joi.string().min(2).max(50).required(),
  lastName: Joi.string().min(2).max(50).required(),
  email: Joi.string().email().required(),
  password: Joi.string().min(6).max(100).required(),
});

const loginSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().required(),
});

const photoSchema = Joi.object({
  title: Joi.string().trim().min(1).max(100).required(),
  description: Joi.string().trim().allow("").max(500).default(""),
});

const commentSchema = Joi.object({
  comment: Joi.string().trim().min(1).max(500).required(),
});

// Returns a middleware that validates req.body against a Joi schema
const validate = (schema) => (req, res, next) => {
  const { error, value } = schema.validate(req.body, {
    abortEarly: false,
    stripUnknown: true,
  });
  if (error) {
    if (req.file) fs.unlink(req.file.path, () => {}); // remove orphan upload
    return res.status(400).json({
      success: false,
      message: "Validation failed",
      errors: error.details.map((d) => d.message),
    });
  }
  req.body = value;
  next();
};

module.exports = { registerSchema, loginSchema, photoSchema, commentSchema, validate };