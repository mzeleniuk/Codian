const express = require('express');
const path = require('path');

const app = express();
const port = 3000;

app.use('/', express.static(__dirname + '/public'));
app.use('/static', express.static(__dirname + '/images'));
app.use('/static', express.static(__dirname + '/js'));
app.use('/static', express.static(__dirname + '/styles'));

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname + '/index.html'));
});

app.listen(port, () => {
    console.log(`Listening at port ${port}`);
});
