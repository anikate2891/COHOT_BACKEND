require('dotenv').config()
const app = require('./src/app')

// Databse Connect & Start
const connectToDB = require('./src/config/database')
connectToDB();

//Server Start
app.listen(3000,()=>{
    console.log('Server is running on port no 3000')
})