const url = 'https://armados-logic-app-v2.azurewebsites.net:443/api/armados-workflow/triggers/manual/invoke?api-version=2022-05-01&sp=%2Ftriggers%2Fmanual%2Frun&sv=1.0&sig=HWN0JbA4wdwQTSFtFvKG-y7SYIx7AeK1RAfVekH2QSc';

module.exports = async function (context, myQueueItem) {
    context.log('JavaScript rabbitmq trigger function processed work item', myQueueItem);
    sendMessage(context, myQueueItem)

};


function sendMessage(context, message) {
    var myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");

    var raw = JSON.stringify({
        "message": message
    });

    var requestOptions = {
        method: 'POST',
        headers: myHeaders,
        body: raw
    };

    fetch(url, requestOptions)
        .then(response => response.text())
        .then(result => context.log('Mensaje enviado: ', result))
        .catch(error => context.log('Error al enviar mensaje', error));
}