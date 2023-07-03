const { body, validationResult } = require('express-validator');
const express = require('express');
const db = require('../db/db');
const router = express.Router();

/* Register user */
router.post('/register',
    body('username').not().isEmpty(),
    body('password').not().isEmpty(),
    async function (req, res, next) {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const user = await db.models.user.create({
            username: req.body.username,
            password: req.body.password
        });

        res.status(201).json(user);
    });

/* Login user */
router.post('/login',
    body('username').not().isEmpty(),
    body('password').not().isEmpty(),
    async function (req, res, next) {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const user = await db.models.user.findOne({
            where: {
                username: req.body.username,
                password: req.body.password
            }
        });

        if (user === null) {
            return res.status(404).json({ error: 'User not found' });
        }

        res.status(200).json(user);
    });

module.exports = router;
