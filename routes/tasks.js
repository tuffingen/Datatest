const express = require('express');
const router = express.Router();
const pool = require('../database');
/* 
    BASE URL /tasks
    GET / - Get all tasks
    POST / - Create a new task
    GET /:id - Get a task by id
    PUT /:id - Update a task by id
    DELETE /:id - Delete a task by id
*/
router.get('/', async (req, res, next) => {

    const flash = req.session.flash;
    req.session.flash = null;


    await pool.promise()
        .query('SELECT * FROM tasks ORDER BY updated_at DESC')
        .then(([rows, fields]) => {
            res.render('tasks.njk', {
                flash: flash,
                tasks: rows,
                title: 'Tasks',
                layout: 'layout.njk'
            });
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({
                tasks: {
                    error: 'Error getting tasks'
                }
            })
        });
});

router.get('/:id', async (req, res, next) => {
    const id = req.params.id;
    if (isNaN(req.params.id)) {
        res.status(400).json({
            task: {
                error: 'Bad request'
            }
        });
    }
    await pool.promise()
        .query('SELECT * FROM tasks WHERE id = ?', [id])
        .then(([rows, fields]) => {
            res.json({
                task: {
                    data: rows
                }
            });
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({
                task: {
                    error: 'Error getting tasks'
                }
            })
        });
});



router.post('/', async (req, res, next) => {
    // { "task": "koda post" }
    const task = req.body.task;

    if (task.length < 3) {

        req.session.flash = "Task can't be less than 3 letters";
        res.redirect('/tasks');

    } else {

        await pool.promise()
            .query('INSERT INTO tasks (task) VALUES (?)', [task])
            .then((response) => {

                if (response[0].affectedRows === 1) {
                    req.session.flash = "Task Added";
                    res.redirect('/tasks');
    
                } else {
                    req.session.flash = "task not found";
                    res.status(400).redirect('/tasks');
                }
                
                console.log(response[0].affectedRows);
                if (response[0].affectedRows === 1) {
                    res.redirect('/tasks');
                } else {
                    res.status(400).json({
                        task: {
                            error: 'Invalid task'
                        }
                    });
                }
            })
            .catch(err => {
                console.log(err);
                res.status(500).json({
                    task: {
                        error: 'Error getting tasks'
                    }
                })
            });
    }



    // res.json(req.body);

});

router.get('/:id/delete', async (req, res, next) => {
    const id = req.params.id;
    if (isNaN(req.params.id)) {
        res.status(400).json({
            task: {
                error: 'Bad request'
            }
        });
    }
    await pool.promise()
        .query('DELETE FROM tasks WHERE id = ?', [id])
        .then((response) => {

            if (response[0].affectedRows === 1) {
                req.session.flash = "Task Deleted";
                res.redirect('/tasks');

            } else {
                req.session.flash = "task not found";
                res.status(400).redirect('/tasks');
            }


        })
        .catch(err => {
            console.log(err);
            res.status(500).json({
                task: {
                    error: 'Error getting tasks'
                }
            })
        });
});

router.post('/:id/complete', async (req, res, next) => {
    // { "task": "koda post" }
    const id = req.params.id;

    await pool.promise()
        .query('UPDATE tasks SET completed = !completed WHERE id = ?', [id])
        .then((response) => {
            console.log(response[0].affectedRows);
            if (response[0].affectedRows === 1) {
                res.redirect('/tasks');
            } else {
                res.status(400).json({
                    task: {
                        error: 'Invalid task'
                    }
                });
            }
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({
                task: {
                    error: 'Error getting tasks'
                }
            })
        });




    // res.json(req.body);

});


module.exports = router;



/*

    await pool
    .promise()
    .query('SELECT * FROM users')
    .then(([rows, fields]) => {
        res.json({
            data: rows,
        });
    })
    .catch((err) => {
        console.log(err);
        res.status(500).json({
            error: 'Database error',
        });
    });

    */