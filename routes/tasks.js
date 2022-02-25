var express = require('express');
const pool = require('../database');
var router = express.Router();
/*
    BASE URL /tasks
    GET / - GETA LL TASKS
    POST / - CREATE A A NEW TASK
    GET /:id - GET A TASK BY ID
    PUT/:id - UPDATE TO TASK BY ID
    DELETE/:id - DELETE A TASK BY ID
*/

/* GET home page. */
router.get('/', async (req, res, next) => {
    await pool.promise()
        .query('SELECT * FROM tasks ORDER BY updated_at')
        .then(([rows, fields]) => {
            res.render('tasks.njk', {
                tasks: rows,
                title: 'Tasks',
                layout: 'layout.njk',
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


        .catch(err => {
            console.log(err);

            res.status(500).json({
                tasks: {
                    error: 'Error getting tasks'
                }
            })
        });

    console.log(id);
    res.json({

        id: req.params.id

    })

});


router.get('/:id/delete', async (req, res, next) => {
    const id = req.params.id;
    res.json(`deleting task ${id}`);

    if (isNaN(req.params.id)) {
        res.status(400).json({
            task: {
                error: 'Bad request'
            }
        });
    }
    await pool.promise()
        .query('DELETE FROM tasks WHERE id = ?', [id])
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
                tasks: {
                    error: 'Error getting tasks'
                }
            })
        });
});

router.post('/', async (req, res, next) => {

    const task = req.body.task;
       if (task.lenght < 3) {
    //     res.render(tasks.njk),{
    //     task: req.body.task,
    //     tasks: [],
    //     title: 'Tasks',
    //     layout: layout.njk
    // }
           
    }//else{
       // res.status(500).json({
         //   tasks: {
           //     error: 'Too short task'
            //}
        //})

    //}
    await pool.promise()
        .query('INSERT INTO tasks (task) VALUES (?)', [task])
        .then((response) => {
            console.log(response[0].affectedRows)
            if (response[0].affectedRows == 1) {
                res.redirect('/tasks')
            } else {
                res.status(400).json({
                    task: {
                        error: 'Invalid task'
                    }
                })
            }
            //res.json({
            //
            //    task: {
            //        data: response
            //    }
            //   });
        })

        .catch(err => {
            console.log(err);

            res.status(500).json({
                tasks: {
                    error: 'Error posting tasks'
                }
            })
        });


});
router.post('/:id/update', async (req, res, next) => {
    const task = req.body.task;
    const id = req.params.id;

    await pool.promise()
        .query('INSERT INTO tasks (task) VALUES (?)', [task])
        .then(([response]) => {



            res.json({

                task: {
                    data: response
                }
            });
        })

        .catch(err => {
            console.log(err);

            res.status(500).json({
                tasks: {
                    error: 'Error posting tasks'
                }
            })
        });

});

module.exports = router;

