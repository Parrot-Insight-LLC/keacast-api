const { body, param, query, check, validationResult } = require('express-validators');

exports.validateCreateUser = [
     body('firstname').isLength({min: 1}).withMessage('Please enter a valid First Name'),
     body('firstname').not().isNumeric().withMessage('This field must contain only letters and hiphens'),
     body('lastname').isLength({ min: 1 }).withMessage('Please enter a valid Last Name'),
     body('lastname').not().isNumeric().withMessage('This field must contain only letters and hiphens'),
     body('phone').isMobilePhone().withMessage('This is not a valid phone number'),
     body('phone').isLength({min: 9, max: 10}).withMessage('Please enter a valid phone number'),
     body('username').isLength({min: 1}).withMessage('Please enter a valid username')
]