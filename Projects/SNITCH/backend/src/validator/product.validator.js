import {body, validationResult} from 'express-validator';


function validateRequest(req, res, next) {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    next();
}


export const validateProduct = [
    body('title').notEmpty().withMessage('Title is required'),
    body('description').optional().isString().withMessage('Description must be a string'),
    body('priceCurrency').notEmpty().withMessage('Price currency is required').isIn(['USD', 'EUR', 'GBP']).withMessage('Price currency must be USD, EUR, or GBP'),
    body('priceAmount').notEmpty().withMessage('Price amount is required').isFloat({gt: 0}).withMessage('Price must be a positive number'),
    validateRequest
];