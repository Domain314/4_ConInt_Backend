const { body, validationResult } = require('express-validator');

const db = require('../db/db');

const express = require('express');
const router = express.Router();

/* Read all todos */
router.get('/', async function geta(req, res, next) {
    // if there is no userId provided, return an error
    if (!req.query.userId) {
        console.log('no user ID');
        return res.status(400).json({ error: 'userId is required' });
    }



    const todos = await db.models.todo.findAll({
        where: {
            userId: req.query.userId // only get todos that belong to the user
        }
    });

    res.status(200).json(todos);
});




/* Create todos */
router.post('/',
    body('name').not().isEmpty(),
    body('name').isLength({ max: 255 }),
    body('userId').not().isEmpty().isNumeric(),
    async function posta(req, res, next) {
        const user = await db.models.user.findByPk(req.body.userId);

        if (!user) {
            return res.status(400).json({ error: 'User does not exist' });
        }

        const date = getStringDate();

        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const todo = await db.models.todo.create({
            name: req.body.name,
            userId: req.body.userId,
            date
        });

        res.status(201).json(todo);
    });

async function updateTodoDoneStatus(req, res, doneStatus) {
    const pk = req.params.id;
    const todo = await db.models.todo.findByPk(pk);

    if (todo == null) {
        res.status(404);
        return;
    }

    const updatedTodo = await todo.update({ done: doneStatus });

    res.status(200).json(updatedTodo);
}

/* Update todos with done */
router.put('/:id/done', async function puta(req, res, next) {
    await updateTodoDoneStatus(req, res, true);
});

/* Update todos with undone */
router.delete('/:id/done', async function deletea(req, res, next) {
    await updateTodoDoneStatus(req, res, false);
});

module.exports = router;

// UTILS
function getStringDate() {
    const today = new Date();
    const dd = String(today.getDate()).padStart(2, '0');
    const mm = String(today.getMonth() + 1).padStart(2, '0');
    const yyyy = today.getFullYear();

    return `${yyyy}-${mm}-${dd}`;
}
