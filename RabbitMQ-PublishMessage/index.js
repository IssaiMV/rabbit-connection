module.exports = async function (context, input) {
    context.log('JavaScript HTTP trigger function processed a request.');

    const message = input.body;
    context.log(input);
    context.log(context.bindings);
    context.bindings.outputMessage = input.body;
};