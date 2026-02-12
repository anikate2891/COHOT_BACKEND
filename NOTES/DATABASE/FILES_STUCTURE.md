- server.js:
    - dotenv req
    - database & app connect

- src
    - app.js:
        - express req & call
        - notemodel connect
        - makes notes [post, get, delete, etc]
        - export app
        - req cookie-parser & called

        - config
            - database.js:
            - mongoose req
            - connectoDB() create & export

        - models
            - notes.model.js:
            - create schema & notemodel
            - export notemodel

        - rouths
            - auth.rouths.js:
            - req express & notemodel
            - create api's
            - req jasonwebtoken {jwt}
            - call cookie [res.cookie()]