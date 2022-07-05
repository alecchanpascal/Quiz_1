const express = require('express');
const knex = require('../db/client');
const router = express.Router();

router.get('/', (request, response) => {
    knex('clucks').orderBy('created_at', 'desc')
    .then(clucks => {
        let hashtags = {};
        let indexes = [];
        clucks.forEach(element => {
            if (element.content.includes('#')) {
                element.content = element.content.replaceAll('\r\n', ' ');
                element.content += ' ';
                for (let i = 0; i < element.content.length; i++) {
                    if (element.content[i] == '#') {
                        indexes.push(i);
                    }
                }
                if (indexes.length > 0) {
                    for (let i = 0; i < indexes.length; i++) {
                        for (let j = indexes[i]; j < element.content.length; j++) {
                            if (element.content[j] == ' ') {
                                hashtags[element.content.slice(indexes[i], j)] = hashtags[element.content.slice(indexes[i], j)] ? hashtags[element.content.slice(indexes[i], j)] += 1 : 1;
                                break;
                            }
                        }
                    }
                }
            }
            indexes = [];
            return hashtags;
        });
        let sorted = [];
        for (const hash in hashtags) {
            sorted.push([hash, hashtags[hash]]);
        }
        sorted.sort(function(a, b) {
            return b[1] - a[1];
        });
        response.render('clucks', {clucks: clucks, hashtags: sorted});
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

router.post('/signinFirst', (request, response) => {
    response.cookie('username', request.body.username);
    response.redirect('/clucks/new');
})

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