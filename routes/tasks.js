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
        .query('SELECT * FROM tasks')
        .then(([rows, fields]) => {
            console.log(rows)
            res.json({
                tasks: {
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

router.get('/:id', async (req, res, next) => {

    const id = req.params.id;

    if(isNaN(req.params.id)){
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
    res.json( 'deleting task ${id}');
});


module.exports = router;

