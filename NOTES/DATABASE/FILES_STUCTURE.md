- server.js:
    - dotenv req
    - database & app connect
    - call dotenv

- src
    - app.js:
        - express req & call
        - req routh & called
        - req cookie-parser & called
        - export app

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
            - req express(Router) & notemodel
            - create api's
            - req jasonwebtoken {jwt}
            - req crypto
            - call cookie [res.cookie()]