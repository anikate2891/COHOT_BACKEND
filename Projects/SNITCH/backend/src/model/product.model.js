import mongoose from 'mongoose';

const productSchema = new mongoose.Schema({
    title:{
        type:String,
        required:true
    },
    description:{
        type:String,
        required:true
    },
    seller: {
        type:mongoose.Schema.Types.ObjectId,
        ref:'Users',
        required:true
    },
    price:{
        amount:{
            type:Number,
            required:true
        },
        currency:{
            type:String,
            required:true,
            enum: ["INR","USD","EUR","GBP","JPY","CNY"],
            default:"INR"
        }
    },
    images:[{
        url:{type:String, required:true},
        // alt:{type:String}
    }]
}, { timestamps: true });

const productModel= mongoose.model('Product', productSchema);
export default productModel;    