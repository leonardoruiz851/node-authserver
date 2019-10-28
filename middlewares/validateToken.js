const jwt = require('jsonwebtoken');

const validateToken = function(req, res, next) {
    const token = req.body.token;
    if (!token) {
        res.status(401).json({ message: 'Unauthorized' });
    } else {
        jwt.verify(token, process.env.SECRET_TOKEN, function(err, decoded) {
            if (err) {
                res.status(401).json({ message: 'Unauthorized' });
            } else {
                req.email = decoded.email;
                next();
            }
        });
    }
}

module.exports = validateToken;