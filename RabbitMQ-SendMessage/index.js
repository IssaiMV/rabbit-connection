
module.exports = async function (context, req) {

    context.log('JavaScript HTTP trigger function processed a request.');
    const message = (req.query.message || (req.body && req.body.message));
    const clientId = (req.query._clientId || (req.body && req.body._clientId));

    var amqp = require("amqp-ts");
    var connection = new amqp.Connection("amqps://ajqhzdgj:yiI1jdL5aepHLbAnxKMU-1R9ApQrok91@dramatic-gold-ladybird.rmq5.cloudamqp.com/");
    var exchange = connection.declareExchange("ops", 'topic', { durable: true });
    const options = {
        deliveryMode: 2,
        contentType: 'application/json',
        correlationId: clientId,
        replyTo: 'output_queue',
        expiration: '10000', // 10 segundos
        priority: 1,
        messageId: clientId,
        timestamp: new Date().getTime()
    };
    exchange.send(new amqp.Message(message, options), 'output');

    const responseMessage = message
        ? "Hello, " + message + ". This HTTP triggered function executed successfully."
        : "This HTTP triggered function executed successfully. Pass a name in the query string or in the request body for a personalized response.";

    context.res = {
        // status: 200, /* Defaults to 200 */
        body: responseMessage
    };
}