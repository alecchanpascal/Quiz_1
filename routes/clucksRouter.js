const express = require('express');
const knex = require('../db/client');
const router = express.Router();

router.get('/', (request, response) => {
    knex('clucks').orderBy('created_at', 'desc')
    .then(clucks => {
        response.render('clucks', {clucks: clucks});
    });
});

router.post('/', (request, response) => {
    const username = request.cookies.username
    knex('clucks').insert({
        username: username,
        content: request.body.content,
        imageUrl: request.body.imageUrl ? request.body.imageUrl : ''
    }).returning('*').then(() => {
        response.redirect('/clucks');
    });
})

router.get('/signin', (request, response) => {
    response.render('signin');
});

router.post('/signin', (request, response) => {
    response.cookie('username', request.body.username);
    response.redirect('/clucks');
});

router.get('/signout', (request, response) => {
    response.clearCookie('username');
    response.redirect('/clucks');
});

router.get('/new', (request, response) => {
    if (request.cookies.username) {
        response.render('new');
    } else {
        response.render('signinFirst');
    }
});

module.exports = router;