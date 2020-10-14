'use strict';

const { PubSub, v1 } = require('@google-cloud/pubsub');
const { subscriberEvent } = require('./../middlewares/suscriberEvent');
const path = require('path');

//Variables de entorno para conexion
const topicName = process.env.GCLOUD_TOPIC_NAME || '';
const projectId = process.env.GCLOUD_PROJECT_ID || '';
const credentialsGcloub = process.env.GCLOUD_CREDENTIAL || '';
const credentials = path.join(__dirname, credentialsGcloub);
const subscriptionName = process.env.GCLOUD_SUBSCRIPTION_NAME || '';

/*
const buffer = Buffer.from(credentialsGcloub, 'base64');
const credentialDecode = buffer ? buffer.toString() : null;
const credentialJson = JSON.parse(credentialDecode);
*/
//Cliente PubSub
const pubsub = new PubSub({
    projectId: projectId,
    keyFilename: credentials
});
/*
// Cliente suscriptor
const subClient = new v1.SubscriberClient({
    projectId: projectId,
    keyFilename: credentials
});
const formattedSubscription = subClient.subscriptionPath(
    projectId,
    subscriptionName
);

// Mensajes maximos retornados por la peticion
const request = {
    subscription: formattedSubscription,
    maxMessages: 2,
};
*/
module.exports = {
    pubsub: pubsub,
    topicName: topicName,
    subscriberEvent: subscriberEvent,
    //subClient: subClient,
    timeout: 60,
    publish: async (messageData) => {
        return new Promise(async function (resolve, reject) {
            try {
                const pubsubClient = module.exports.pubsub;
                const stringData = JSON.stringify(messageData);
                const dataBuffer = Buffer.from(stringData);
                //const customAttributes = messageAttributes;
                //const messageId = await pubsubClient.topic(topicName).publish(dataBuffer, customAttributes);
                const messageId = await pubsubClient.topic(module.exports.topicName).publish(dataBuffer);
                resolve(messageId);
                console.log(`Mensaje ${messageId} publicado.`);
            } catch (e) {
                console.log(e.message);
                //logger.error(null, e.message);
                reject(e.message);
            }
        })
    },
    subscriptionPull: async () => {
    /*  //Pull Sincrono
        const subscriptionClient = module.exports.subClient;
        // Suscriptor extrae un numero especifico de mensajes
        const [response] = await subscriptionClient.pull(request);

        // Procesa los mensajes
        const ackIds = [];
        for (const message of response.receivedMessages) {
         console.log(`Received message: ${message.message.data}`);
            ackIds.push(message.ackId);
        }
        // Reconoce los mensajes (Acknowledge)
        const ackRequest = {
            subscription: formattedSubscription,
            ackIds: ackIds,
        };
        await subscriptionClient.acknowledge(ackRequest);
        console.log('Fin de la extraccion de mensajes');
    }
    */
        //Pull asincrono
        const subscription = pubsub.topic(topicName).subscription(subscriptionName); //Instancia a la suscripcion
        let messageCount = 0;

        const messageHandler = message => {
            console.log(`Received message ${message.id}:`);
            console.log(`\tData: ${message.data}`);
            console.log(`\tAttributes: ${message.attributes}`);
            messageCount += 1;
            message.ack();
            module.exports.subscriberEvent(JSON.parse(message.data)); //Busca en redis e inserta en base de datos
        };
        const errorHandler = error => {
            // Do something with the error
            console.error(`ERROR: ${error}`);
            throw error;
        };

        // Listen for new messages/errors until timeout is hit
        subscription.on('message', messageHandler);
        subscription.on('error', errorHandler);

        setTimeout(() => {
            subscription.removeListener('message', messageHandler);
            console.log(`${messageCount} message(s) received.`);
            subscription.removeListener('error', errorHandler);
        }, module.exports.timeout * 1000);
    }
}