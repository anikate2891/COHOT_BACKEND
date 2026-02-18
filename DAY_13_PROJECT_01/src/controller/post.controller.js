const postModel = require('../models/post.model')
const imagekit = require('@imagekit/nodejs')
const {toFile} = require('@imagekit/nodejs')
const jwt = require('jsonwebtoken');
const { post } = require('../app');



const image = new imagekit({ privateKey: process.env.IMAGE_PRIBATE_KEY })

//POSTHANDELER
async function createPostController(req,res){
//
    //After Read documentation come back and read this
    let file = await image.files.upload({
        file: await toFile (Buffer.from(req.file.buffer), 'file'),
        fileName: 'Test',
        folder: 'COHOT-INSTA_CLONE'
    })
    //After Read documentation come back and read this
//


    const post = await postModel.create({
        caption:req.body.caption,
        imgUrl: file.url,
        user: req.user.id
    })

    res.status(201).json({message:'Post created..', post})
}

async function getpostcontroller(req,res){
    const user = req.user.id

    const posts = await postModel.find({user: user})
    res.status(200).json({
        message : 'All Posts is there',
        posts
    })




} 


async function getpostDetailsController(req,res){

    const userId = req.user.id
    const postId = req.params.postId

    const post = await postModel.findById(postId)
    if(!post){
        return res.status(404).json({
            message:'Post not found.'
        })
    }

    const isValidUser = post.user.toString() === userId
    if(isValidUser){
        return res.status(403).json({message:'Forbidden Content'})
    }

    return res.status(200).json({
        message:'Post Fetched..',
        post
    })

}

module.exports = {createPostController,getpostcontroller,getpostDetailsController}