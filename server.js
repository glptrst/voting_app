const express = require('express');

const app = express();

app.set('views', './views');
app.set('view engine', 'pug');

app.get('/', (req, res, next) => {
    res.render('index', {title: 'Voting App'});
    next();
});

app.listen(3000, () => console.log('Listening on port 3000!'));
