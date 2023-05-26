const Ajv = require("ajv")

const URL_LOGIC_APP = 'https://prod-27.southcentralus.logic.azure.com:443/workflows/545104cac4bc40e88402762795b541db/triggers/manual/paths/invoke?api-version=2016-10-01&sp=%2Ftriggers%2Fmanual%2Frun&sv=1.0&sig=RQHUm3A97_jNR4oHLbcsQ-2T1sWVNWcMoYPPkPWmyOU'
const URL_AZURE_FUNCTION = 'https://dev-rabbitmq-engine.azurewebsites.net/api/RabbitMQ-SendMessage?code=LscMPOkfGyUcu5okzs0nTbyWZyEVBQuEEJgjUcl4fQkiAzFunVYJRg=='

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
                                        "type": "number"
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
                                    "splitOrderDetails",
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
                        "familyConfigurations",
                        "splitOrderDetails"
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
                                                    "type": "number"
                                                },
                                                "familyIdentifier": {
                                                    "type": "number"
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

function buildUrl(body) {
    const { valid, errorMessage } = validateMessage(body)
    const myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json")
    const url = valid ? URL_LOGIC_APP : URL_AZURE_FUNCTION
    const bodyFetch = valid ? { ...body } : { "message": errorMessage, _clientId: body.clientId }
    const requestOptions = { method: 'POST', headers: myHeaders, body: JSON.stringify(bodyFetch) }
    return fetch(url, requestOptions)
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

module.exports = async function (context, message) {
    context.log('JavaScript rabbitmq trigger function processed work item', message)
    try {
        if (typeof message.message === 'string') {
            message = {
                clientId: message.clientId,
                message: JSON.parse(message.message)
            }
        }
        const response = await buildUrl(message);
        context.log('El mensaje se ha enviado correctamente. Status: ' + response.status);
    } catch (error) {
        context.log('Ha ocurrido un error al intentar enviar el mensaje', error);
    }
}