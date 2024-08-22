const mongoose = require('mongoose')

const blogSchema = new mongoose.Schema({
    title:{
        type:String,
        required:[true,"Title is required"],
    },
    description:{
        type:String,
        required:[true,"Description is required"],
    },
    image:{
        type:String,
        required:[true,"image is required"],
    },
    content:{
        type:String,
        required:[true,"content is required"],
    },
    comment: [{
        // text: {
        //     type: String,
        //     required: true,
        // },
        // username: {
        //     type: String,
        //     required: true,
        // },
        username: {
            type: String,
            required: true,
            default: "Anonymous"
          },
        comment: String,
        createdAt: Date
        // Optionally, you can add fields like author, timestamp, etc.
    }],
    user:{
        type:mongoose.Types.ObjectId,
        ref:'User',
        require:[true,"User id is required"],
    },
},
{timestamps:true}
);

const blogModel = mongoose.model("Blog",blogSchema);

module.exports = blogModel;