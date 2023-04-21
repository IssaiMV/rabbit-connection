
module.exports = async function (context, req) {

    context.log('JavaScript HTTP trigger function processed a request.');
    const message = (req.query.message || (req.body && req.body.message));

    context.log(message)

    var amqp = require("amqp-ts");
    var connection = new amqp.Connection("amqp://ops:ops@200.52.64.101:5672");
    var exchange = connection.declareExchange("ops", 'topic', { durable: true });
    exchange.send(new amqp.Message(message), 'output');


    const responseMessage = message
        ? "Hello, " + message + ". This HTTP triggered function executed successfully."
        : "This HTTP triggered function executed successfully. Pass a name in the query string or in the request body for a personalized response.";

    context.res = {
        // status: 200, /* Defaults to 200 */
        body: responseMessage
    };
}