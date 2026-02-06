- server.js:
    - dotenv req
    - database & app connect

- config
    - database.js:
        - mongoose req
        - connectoDB() create & export

- models
    - app.js:
        - express req & call
        - notemodel connect
        - makes notes [post, get, delete, etc]
        - export app
    - notes.model.js:
        - create schema & notemodel
        - export notemodel