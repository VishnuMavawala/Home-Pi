const express = require('express');
const bodyParser = require('body-parser');
const Pusher = require('pusher-js/node');
const axios = require('axios');
// const pusherConfig = require('./pusher.json');
var pusherConfig;
var user='u112';

var arr=[
    {key: 1, value: true},
    {key: 2, value: false},
    {key: 3, value: true},
    {key: 4, value: true}];

const app = express();
app.use(bodyParser.json());

app.get('/api/:arduino/arduinoInit', function(req, res) {
    console.log('User joined: ', req.params.arduino);
    axios.get(`${pusherConfig.restServer}/api/${user}/init`);
    res.send(arr);
});
app.post('/api/:arduino/part', function(req, res) {
    console.log('User part: ', req.body);
    arr=req.body;
    axios.post(`${pusherConfig.restServer}/api/${user}/part`, arr);
    res.sendStatus(204);
});
app.listen(4000, function() {
    console.log('App listening on port 4000');
});

axios.post('https://vishnumavawala.000webhostapp.com/Home/pusher.php', { 'device': 'Pi' })
    .then((res) => {
        pusherConfig=res.data;
        console.log('Connection Establishment');
        // Pass Data on Server.
        axios.post(`${pusherConfig.restServer}/api/${user}/assign`, arr);

        // Client which handle response to server
        var pusher = new Pusher(pusherConfig.key, {
            cluster: pusherConfig.cluster,
            encrypted: true
        });

        var channel = pusher.subscribe(user);
        channel.bind('part', (data) => {
            console.log(data);
            axios.post('http://192.168.0.103:80/body', data);
        });
    });