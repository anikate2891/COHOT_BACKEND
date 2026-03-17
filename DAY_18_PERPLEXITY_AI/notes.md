- Authentication System
  - User Registration
  - User Login
  - Password Reset
  - Two-Factor Authentication

- Chat With Ai
- Chat History
- All messages are stored in the database
- Ai with internet fetures

- Data Modeling
    - User Model
        - _id
        - username
        - email
        - password
        - createdAt
        - updatedAt
        - Varified
    - Message Model
        - _id
        - user
        - title
        - content
        - createdAt
        - updatedAt
    - Chat Model
        - _id
        - chat
        - messages
        - role [user, assistant]
        - createdAt
        - updatedAt


npm i socketio-client