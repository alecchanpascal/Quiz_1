const express = require('express');
const knex = require('../db/client');
const router = express.Router();

router.get('/signin', (request, response) => {
    response.render('signin');
})

module.exports = router;