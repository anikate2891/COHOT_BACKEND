const postModel = require('../models/post.model')
const imagekit = require('@imagekit/nodejs')
const {toFile} = require('@imagekit/nodejs')

const image = new imagekit({ privateKey: process.env.IMAGE_PRIBATE_KEY })

async function createPostController(req,res){
    console.log(req.body, req.files)

    //After Read documentation come back and read this
    let file = await image.files.upload({
        file: await toFile (Buffer.from(req.file.buffer), 'file'),
        fileName: 'Test'
    })

    res.send(file)  
}




module.exports = {createPostController}