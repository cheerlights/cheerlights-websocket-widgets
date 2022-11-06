var cheerlights_mqtt = {

    server: 'wss.cheerlights.com',
    wss_port: 443,
    client_id: 'cheerlights_js_' + Math.random().toString(16).substr(2, 8),
    timeout: 5000,
    interval: false,
    color_topic: 'color',
    hex_topic: 'hex'

};

cheerlights_connect();

function cheerlights_connect() {

    // create a client instance for the cheerlights mqtt server
    client = new Paho.MQTT.Client(cheerlights_mqtt.server, cheerlights_mqtt.wss_port, cheerlights_mqtt.client_id);

    // set callback handlers
    client.onConnectionLost = cheerlights_reconnect;
    client.onFailure = cheerlights_reconnect;
    client.onMessageArrived = cheerlights_message;

    // connect the client
    client.connect({
        onSuccess: cheerlights_subscribe,
        useSSL: true
    });

}

function cheerlights_subscribe() {

    // clear interval
    clearInterval(cheerlights_mqtt.interval);

    // subscribe to the cheerlights color topic
    client.subscribe(cheerlights_mqtt.color_topic);

}

function cheerlights_reconnect(responseObject) {

    // try to connect to cheerlights after timeout
    cheerlights_mqtt.interval = setInterval(cheerlights_connect, cheerlights_mqtt.timeout);

}

function cheerlights_message(message) {

    const widget = document.getElementById('widget');

    // set the background color to the latest cheerlights color
    widget.style.backgroundColor = message.payloadString;

}
