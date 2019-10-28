var express = require('express');
var router = express.Router();
const jwt = require('jsonwebtoken');

const User = require('../models/User');
const validateToken = require('../middlewares/validateToken');

router.get('/data', validateToken, function(req, res) {
    const { email } = req;
    User.findOne({ email }, function(err, user) {
        if (err) {
            res.status(500).json({ message: 'Internal server error' });
        } else if (!user) {
            res.status(401).json({ message: 'User not found' });
        } else {
            res.status(200).json({
                name: user.name,
                email: user.email,
                registered: user.registered,
                last_access: user.last_access,
                followers: user.followers,
                following: user.following
            });
        }
    });
});

router.post('/register', function(req, res) {
    const { name, email, password } = req.body;
    const user = new User({ name, email, password });
    user.save(function(err) {
        if (err) {
            if (err.name === 'ValidationError') {
                res.status(500).json(err.errors);
            } else if (err.message.indexOf('duplicate key error') !== -1) {
                res.status(500).json({ message: 'User already registered' });
            } else {
                res.status(500).json({ message: 'Internal server error' });
            }
        } else {
            res.status(200).json({ message: 'User registered successfully' });
        }
    });
});

router.post('/authenticate', function(req, res) {
    const { email, password } = req.body;
    User.findOne({ email }, function(err, user) {
        if (err) {
            res.status(500).json({ message: 'Internal server error' });
        } else if (!user) {
            res.status(401).json({ message: 'User not found' });
        } else {
            user.checkPassword(password, function(err, same) {
                if (err) {
                    res.status(500).json({ message: 'Internal server error' });
                } else if (!same) {
                    res.status(401).json({ message: 'Incorrect password' });
                } else {
                    user.last_access = Date.now();
                    user.save();
                    const payload = { email };
                    const token = jwt.sign(payload, process.env.SECRET_TOKEN, { expiresIn: '1h' });
                    res.status(200).json({ message: 'User authenticated', token: token });
                }
            });
        }
    });
});

module.exports = router;
