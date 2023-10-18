module.exports = async function (context, req) {

    context.log('JavaScript HTTP trigger function processed a request.');
    const message = (req.query.message || (req.body && req.body.message));
    const clientId = (req.query._clientId || (req.body && req.body._clientId));

    if (clientId) {
        context.log('Client Id: ' + clientId);
    }
    if (message.routeIdentifier) {
        context.log('routeIdentifier: ' + message.routeIdentifier);
    }

    var amqp = require("amqp-ts");
    var connection = new amqp.Connection("amqps://azure-engine:pyobrTW_PkrSHlkcikGdhZPNUzwyokr1@mini-green-skunk.rmq2.cloudamqp.com/tkdtqcou");
    var exchange = connection.declareExchange("ops", 'topic', { durable: true });
    const options = {
        contentType: 'application/json',
        correlationId: clientId,
        replyTo: 'output_queue_' + clientId,
        priority: 1,
        messageId: clientId,
        timestamp: new Date().getTime()
    };
    exchange.send(new amqp.Message(message, options), clientId);

    const responseMessage = message
        ? "Hello, " + message + ". This HTTP triggered function executed successfully."
        : "This HTTP triggered function executed successfully. Pass a name in the query string or in the request body for a personalized response.";

    setTimeout(function () {
        connection.close();
    }, 500);

    context.res = {
        // status: 200, /* Defaults to 200 */
        body: responseMessage
    };
}