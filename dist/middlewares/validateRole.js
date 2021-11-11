"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateRole = void 0;
const validateRole = (req, res, next) => {
    try {
        const rolUser = req.role;
        if (rolUser !== 'model')
            return res.status(403).json({ error: 'Unauthorized role' });
        next();
    }
    catch (error) {
        console.log('Error: validateRole', error.message);
    }
};
exports.validateRole = validateRole;
