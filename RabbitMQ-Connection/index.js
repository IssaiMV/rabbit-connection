const Ajv = require("ajv")

const SEND_MESSAGE_FUNCTION_URL = 'https://dev-rabbitmq-engine.azurewebsites.net/api/RabbitMQ-SendMessage?code=LscMPOkfGyUcu5okzs0nTbyWZyEVBQuEEJgjUcl4fQkiAzFunVYJRg=='
const OPTIMAL_TRANSPORT_FUNCTION_URL = 'https://dev-armados-engine.azurewebsites.net/api/optimal-transport?code=kWbjnx84xI8Tf4KUvp1C51uUKkumZYAnf8qsQVnPbN7RAzFugUOY7g=='

const schema = {
    "type": "object",
    "properties": {
        "clientId": {
            "type": "string"
        },
        "message": {
            "type": "object",
            "properties": {
                "routeIdentifier": {
                    "type": "number"
                },
                "transportConfiguration": {
                    "type": "object",
                    "properties": {
                        "positions": {
                            "type": "array",
                            "items": {
                                "type": "object",
                                "properties": {
                                    "positionIdentifier": {
                                        "type": "number"
                                    },
                                    "maxHeight": {}
                                },
                                "required": [
                                    "positionIdentifier",
                                    "maxHeight"
                                ]
                            }
                        }
                    },
                    "required": [
                        "positions"
                    ]
                },
                "assemblyConfiguration": {
                    "type": "object",
                    "properties": {
                        "maxHeight": {
                            "type": "number"
                        },
                        "maxLayers": {},
                        "createVirtualPositions": {
                            "type": "boolean"
                        },
                        "familyConfigurations": {
                            "type": "array",
                            "items": {
                                "type": "object",
                                "properties": {
                                    "familyIdentifier": {
                                        "type": ["number", "string"]
                                    },
                                    "splitOrderDetails": {
                                        "type": "boolean"
                                    },
                                    "maxHeight": {},
                                    "maxLayers": {},
                                    "maxProof": {}
                                },
                                "required": [
                                    "familyIdentifier",
                                    "maxHeight",
                                    "maxLayers",
                                    "maxProof"
                                ]
                            }
                        },
                        "splitOrderDetails": {
                            "type": "boolean"
                        }
                    },
                    "required": [
                        "maxHeight",
                        "maxLayers",
                        "createVirtualPositions",
                        "familyConfigurations"
                    ]
                },
                "orders": {
                    "type": "array",
                    "items": {
                        "type": "object",
                        "properties": {
                            "orderIdentifier": {
                                "type": "string"
                            },
                            "orderDetails": {
                                "type": "array",
                                "items": {
                                    "type": "object",
                                    "properties": {
                                        "orderDetailIdentifier": {
                                            "type": "number"
                                        },
                                        "quantity": {
                                            "type": "number"
                                        },
                                        "itemIdentifier": {
                                            "type": "number"
                                        },
                                        "itemConfiguration": {
                                            "type": "object",
                                            "properties": {
                                                "layersByPallet": {
                                                    "type": "number"
                                                },
                                                "boxesByLayer": {
                                                    "type": "number"
                                                },
                                                "height": {
                                                    "type": "number"
                                                },
                                                "sequence": {},
                                                "subfamilyIdentifier": {
                                                    "type": ["number", "string"]
                                                },
                                                "familyIdentifier": {
                                                    "type": ["number", "string"]
                                                }
                                            },
                                            "required": [
                                                "layersByPallet",
                                                "boxesByLayer",
                                                "height",
                                                "sequence",
                                                "subfamilyIdentifier",
                                                "familyIdentifier"
                                            ]
                                        }
                                    },
                                    "required": [
                                        "orderDetailIdentifier",
                                        "quantity",
                                        "itemIdentifier",
                                        "itemConfiguration"
                                    ]
                                }
                            }
                        },
                        "required": [
                            "orderIdentifier",
                            "orderDetails"
                        ]
                    }
                }
            },
            "required": [
                "routeIdentifier",
                "transportConfiguration",
                "assemblyConfiguration",
                "orders"
            ]
        }
    },
    "required": [
        "clientId",
        "message"
    ]
}
function validateMessage(data) {
    const ajv = new Ajv()
    const validate = ajv.compile(schema)
    const valid = validate(data)

    if (!valid) {
        const errorMessage = {
            message: "El mensaje no cumple con el schema",
            errors: validate.errors,
        }
        return { valid, errorMessage }
    }

    return { valid }
}

async function sendHttpPostRequest(url, body) {
    const myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");
    const requestOptions = { method: 'POST', headers: myHeaders, body: JSON.stringify(body) };

    try {
        const response = await fetch(url, requestOptions);

        if (!response.ok) {
            throw new Error('La respuesta de la red no es válida');
        }

        try {
            const responseText = await response.text();
            const responseData = JSON.parse(responseText);
            return responseData;
        } catch (error) {
            return { message: 'Mensaje enviado' };
        }
    } catch (error) {
        throw new Error('Ocurrió un error al procesar la solicitud HTTP: ' + error.message);
    }
}


function sendMessageToValidatedUrl(message) {
    return sendHttpPostRequest(OPTIMAL_TRANSPORT_FUNCTION_URL, message);
}

function sendMessageToNonValidatedUrl(errorMessage, clientId) {
    const bodyFetch = { "message": errorMessage, _clientId: clientId };
    return sendHttpPostRequest(SEND_MESSAGE_FUNCTION_URL, bodyFetch);
}

function sendResponseToRabbitMQ(message, clientId) {
    const bodyFetch = { "message": message, _clientId: clientId };
    return sendHttpPostRequest(SEND_MESSAGE_FUNCTION_URL, bodyFetch);
}

function parseMessageIfString(payload) {
    if (typeof payload.message === 'string') {
        return {
            clientId: payload.clientId,
            message: JSON.parse(payload.message)
        };
    }
    return payload;
}

module.exports = async function (context, payload) {
    context.log('JavaScript rabbitmq trigger function processed work item', payload)
    try {
        payload = parseMessageIfString(payload); // Parse the message if it is a string

        context.log('Client id: ' + payload.clientId);
        context.log('routeIdentifier: ' + payload.message.routeIdentifier);

        // Validate the message
        const validationResult = validateMessage(payload);

        if (!validationResult.valid) {
            context.log('The message did not pass validation:', validationResult.errorMessage);
            // Send the message to another URL for non-validated messages
            context.log('validating result: ', validationResult.errorMessage);
            await sendMessageToNonValidatedUrl(validationResult.errorMessage, payload.clientId);
            context.log('The message has been sent to the non-validated URL ');

            // No response sent to RabbitMQ for non-validated messages
        } else {
            // Send the message to the validated URL
            const response = await sendMessageToValidatedUrl(payload.message);
            context.log('The message has been sent to Optimal Transport successfully.');


            await sendResponseToRabbitMQ(response, payload.clientId);
        }
    } catch (error) {
        context.log('An error occurred while trying to send the message', error);
    }
}