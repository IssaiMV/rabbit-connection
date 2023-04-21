const Ajv = require("ajv")

const URL_LOGIC_APP = 'https://armados-logic-app.azurewebsites.net:443/api/armados-workflow/triggers/manual/invoke?api-version=2022-05-01&sp=%2Ftriggers%2Fmanual%2Frun&sv=1.0&sig=2PdHH-n2HxUH7a67uURPE3cw6ynh1I2NzKz6m5Jd4TI';
const URL_AZURE_FUNCTION = 'https://armados-function-app.azurewebsites.net/api/RabbitMQ-SendMessage?code=SNBXA0Q-8DutijmYieI5ZSlt55gmXoiZvyN6XIbC35MhAzFu6iGUeg==';

const schema = {
    "properties": {
        "assemblyConfiguration": {
            "default": {},
            "examples": [
                {
                    "assembler": "BalanceAssigner",
                    "sequence": [
                        {
                            "field": "quantity",
                            "order": "ASC"
                        }
                    ]
                }
            ],
            "properties": {
                "assembler": {
                    "default": "",
                    "examples": [
                        "BalanceAssigner"
                    ],
                    "title": "The assembler Schema",
                    "type": "string"
                },
                "sequence": {
                    "default": [],
                    "examples": [
                        [
                            {
                                "field": "quantity",
                                "order": "ASC"
                            }
                        ]
                    ],
                    "items": {
                        "default": {},
                        "examples": [
                            {
                                "field": "quantity",
                                "order": "ASC"
                            }
                        ],
                        "properties": {
                            "field": {
                                "default": "",
                                "examples": [
                                    "quantity"
                                ],
                                "title": "The field Schema",
                                "type": "string"
                            },
                            "order": {
                                "default": "",
                                "examples": [
                                    "ASC"
                                ],
                                "title": "The order Schema",
                                "type": "string"
                            }
                        },
                        "required": [
                            "field",
                            "order"
                        ],
                        "title": "A Schema",
                        "type": "object"
                    },
                    "title": "The sequence Schema",
                    "type": "array"
                }
            },
            "required": [
                "assembler",
                "sequence"
            ],
            "title": "The assemblyConfiguration Schema",
            "type": "object"
        },
        "orderConsolidations": {
            "default": [],
            "examples": [
                [
                    {
                        "consolidationIdentifier": "A123186161735xb",
                        "orders": [
                            {
                                "itemConfiguration": {
                                    "boxesByLayer": 10,
                                    "familyIdentifier": "No retornable",
                                    "height": 15,
                                    "layersByPallet": 13,
                                    "sequence": 1,
                                    "subfamilyIdentifier": "L (269)"
                                },
                                "itemIdentifier": 7993,
                                "quantity": 12
                            },
                            {
                                "itemConfiguration": {
                                    "boxesByLayer": 10,
                                    "familyIdentifier": "No retornable",
                                    "height": 15,
                                    "layersByPallet": 48,
                                    "sequence": 1,
                                    "subfamilyIdentifier": "L (330,355)"
                                },
                                "itemIdentifier": 2171,
                                "quantity": 57
                            }
                        ]
                    }
                ]
            ],
            "items": {
                "default": {},
                "examples": [
                    {
                        "consolidationIdentifier": "A123186161735xb",
                        "orders": [
                            {
                                "itemConfiguration": {
                                    "boxesByLayer": 10,
                                    "familyIdentifier": "No retornable",
                                    "height": 15,
                                    "layersByPallet": 13,
                                    "sequence": 1,
                                    "subfamilyIdentifier": "L (269)"
                                },
                                "itemIdentifier": 7993,
                                "quantity": 12
                            },
                            {
                                "itemConfiguration": {
                                    "boxesByLayer": 10,
                                    "familyIdentifier": "No retornable",
                                    "height": 15,
                                    "layersByPallet": 48,
                                    "sequence": 1,
                                    "subfamilyIdentifier": "L (330,355)"
                                },
                                "itemIdentifier": 2171,
                                "quantity": 57
                            }
                        ]
                    }
                ],
                "properties": {
                    "consolidationIdentifier": {
                        "default": "",
                        "examples": [
                            "A123186161735xb"
                        ],
                        "title": "The consolidationIdentifier Schema",
                        "type": "string"
                    },
                    "orders": {
                        "default": [],
                        "examples": [
                            [
                                {
                                    "itemConfiguration": {
                                        "boxesByLayer": 10,
                                        "familyIdentifier": "No retornable",
                                        "height": 15,
                                        "layersByPallet": 13,
                                        "sequence": 1,
                                        "subfamilyIdentifier": "L (269)"
                                    },
                                    "itemIdentifier": 7993,
                                    "quantity": 12
                                },
                                {
                                    "itemConfiguration": {
                                        "boxesByLayer": 10,
                                        "familyIdentifier": "No retornable",
                                        "height": 15,
                                        "layersByPallet": 48,
                                        "sequence": 1,
                                        "subfamilyIdentifier": "L (330,355)"
                                    },
                                    "itemIdentifier": 2171,
                                    "quantity": 57
                                }
                            ]
                        ],
                        "items": {
                            "examples": [
                                {
                                    "itemConfiguration": {
                                        "boxesByLayer": 10,
                                        "familyIdentifier": "No retornable",
                                        "height": 15,
                                        "layersByPallet": 13,
                                        "sequence": 1,
                                        "subfamilyIdentifier": "L (269)"
                                    },
                                    "itemIdentifier": 7993,
                                    "quantity": 12
                                },
                                {
                                    "itemConfiguration": {
                                        "boxesByLayer": 10,
                                        "familyIdentifier": "No retornable",
                                        "height": 15,
                                        "layersByPallet": 48,
                                        "sequence": 1,
                                        "subfamilyIdentifier": "L (330,355)"
                                    },
                                    "itemIdentifier": 2171,
                                    "quantity": 57
                                }
                            ],
                            "properties": {
                                "itemConfiguration": {
                                    "examples": [
                                        {
                                            "boxesByLayer": 10,
                                            "familyIdentifier": "No retornable",
                                            "height": 15,
                                            "layersByPallet": 13,
                                            "sequence": 1,
                                            "subfamilyIdentifier": "L (269)"
                                        },
                                        {
                                            "boxesByLayer": 10,
                                            "familyIdentifier": "No retornable",
                                            "height": 15,
                                            "layersByPallet": 48,
                                            "sequence": 1,
                                            "subfamilyIdentifier": "L (330,355)"
                                        }
                                    ],
                                    "properties": {
                                        "boxesByLayer": {
                                            "examples": [
                                                10
                                            ],
                                            "title": "The boxesByLayer Schema",
                                            "type": "integer"
                                        },
                                        "familyIdentifier": {
                                            "examples": [
                                                "No retornable"
                                            ],
                                            "title": "The familyIdentifier Schema",
                                            "type": "string"
                                        },
                                        "height": {
                                            "examples": [
                                                15
                                            ],
                                            "title": "The height Schema",
                                            "type": "integer"
                                        },
                                        "layersByPallet": {
                                            "examples": [
                                                13,
                                                48
                                            ],
                                            "title": "The layersByPallet Schema",
                                            "type": "integer"
                                        },
                                        "sequence": {
                                            "examples": [
                                                1
                                            ],
                                            "title": "The sequence Schema",
                                            "type": "integer"
                                        },
                                        "subfamilyIdentifier": {
                                            "examples": [
                                                "L (269)",
                                                "L (330,355)"
                                            ],
                                            "title": "The subfamilyIdentifier Schema",
                                            "type": "string"
                                        }
                                    },
                                    "required": [
                                        "familyIdentifier",
                                        "subfamilyIdentifier",
                                        "layersByPallet",
                                        "boxesByLayer",
                                        "height",
                                        "sequence"
                                    ],
                                    "title": "The itemConfiguration Schema",
                                    "type": "object"
                                },
                                "itemIdentifier": {
                                    "examples": [
                                        7993,
                                        2171
                                    ],
                                    "title": "The itemIdentifier Schema",
                                    "type": "integer"
                                },
                                "quantity": {
                                    "examples": [
                                        12,
                                        57
                                    ],
                                    "title": "The quantity Schema",
                                    "type": "integer"
                                }
                            },
                            "required": [
                                "itemIdentifier",
                                "quantity",
                                "itemConfiguration"
                            ],
                            "title": "A Schema",
                            "type": "object"
                        },
                        "title": "The orders Schema",
                        "type": "array"
                    }
                },
                "required": [
                    "consolidationIdentifier",
                    "orders"
                ],
                "title": "A Schema",
                "type": "object"
            },
            "title": "The orderConsolidations Schema",
            "type": "array"
        },
        "routeIdentifier": {
            "default": "",
            "examples": [
                "Ruta 1"
            ],
            "title": "The routeIdentifier Schema",
            "type": "string"
        },
        "transportConfiguration": {
            "default": {},
            "examples": [
                {
                    "positions": [
                        {
                            "maxheight": null,
                            "positionIdentifier": "1"
                        },
                        {
                            "maxheight": 15,
                            "positionIdentifier": "2"
                        }
                    ]
                }
            ],
            "properties": {
                "positions": {
                    "default": [],
                    "examples": [
                        [
                            {
                                "maxheight": null,
                                "positionIdentifier": "1"
                            },
                            {
                                "maxheight": 15,
                                "positionIdentifier": "2"
                            }
                        ]
                    ],
                    "items": {
                        "examples": [
                            {
                                "maxheight": null,
                                "positionIdentifier": "1"
                            },
                            {
                                "maxheight": 15,
                                "positionIdentifier": "2"
                            }
                        ],
                        "properties": {
                            "maxheight": {
                                "examples": [
                                    null,
                                    15
                                ],
                                "title": "The maxheight Schema",
                                "type": [
                                    "null",
                                    "integer"
                                ]
                            },
                            "positionIdentifier": {
                                "examples": [
                                    "1",
                                    "2"
                                ],
                                "title": "The positionIdentifier Schema",
                                "type": "string"
                            }
                        },
                        "required": [
                            "positionIdentifier"
                        ],
                        "title": "A Schema",
                        "type": "object"
                    },
                    "title": "The positions Schema",
                    "type": "array"
                }
            },
            "required": [
                "positions"
            ],
            "title": "The transportConfiguration Schema",
            "type": "object"
        }
    },
    "required": [
        "routeIdentifier",
        "transportConfiguration",
        "assemblyConfiguration",
        "orderConsolidations"
    ],
    "type": "object"
};

function sendToDestination(context, message, isValid) {
    const myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");

    const requestOptions = {
        method: 'POST',
        headers: myHeaders,
        body: isValid ? JSON.stringify({ ...message }) : JSON.stringify({ "message": message })
    };

    const url = isValid ? URL_LOGIC_APP : URL_AZURE_FUNCTION;
    // console.log('url', url);
    console.log('message', message);
    fetch(url, requestOptions)
        .then(response => response.text())
        .then(result => console.log('Mensaje enviado: ', result))
        .catch(error => console.log('Error al enviar mensaje', error));
}

function validateMessage(data) {
    const ajv = new Ajv();
    const validate = ajv.compile(schema);
    const valid = validate(data);

    if (!valid) {
        const errorMessage = {
            message: "El mensaje no cumple con el schema",
            errors: validate.errors,
        };
        return { valid, errorMessage };
    }

    return { valid };
}

module.exports = async function (context, message) {
    // context.log('JavaScript rabbitmq trigger function processed work item', message);
    const { valid, errorMessage } = validateMessage(message);
    // console.log('valid', valid);
    if (valid) {
        sendToDestination(context, message, valid);
    } else {
        sendToDestination(context, errorMessage, valid);
    }
};