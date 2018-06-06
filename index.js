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
        });
    });