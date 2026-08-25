const { check, validationResult } = require('express-validator');

// Generic handler to send 400 Bad Request if validation fails
const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  next();
};

// Strict rules for the Contact/Inquiry Form
const validateInquiry = [
  check('name').isString().trim().notEmpty().escape().withMessage('Name must be text and cannot be empty'),
  check('phone').matches(/^[0-9+\-\s]+$/).withMessage('Phone must contain only numbers and valid symbols (+, -)'),
  check('email').optional({ checkFalsy: true }).isEmail().normalizeEmail().withMessage('Must be a valid email address'),
  check('message').isString().trim().notEmpty().escape().withMessage('Message must be text'),
  handleValidationErrors
];

// Strict rules for Saving a Studio Design
const validateStudioSave = [
  check('clientInfo.name').isString().trim().notEmpty().escape().withMessage('Name is required'),
  check('clientInfo.email').isEmail().normalizeEmail().withMessage('Must be a valid email address'),
  check('clientInfo.phone').matches(/^[0-9+\-\s]+$/).withMessage('Phone must contain only numbers'),
  handleValidationErrors
];

module.exports = { validateInquiry, validateStudioSave };
