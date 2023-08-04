module.exports = async function (context, myTimer) {
    var timeStamp = new Date().toISOString();

    if (myTimer.isPastDue) {
        context.log('La función se está ejecutando con retraso.');
    }
    context.log('La Function App se mantiene activa a las:', timeStamp);
};