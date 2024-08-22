const mongoose =require('mongoose')
const connectDB=async()=>{
    try{
        await mongoose.connect('mongodb+srv://21501a05a8:gayatri460@cluster0.dqtis06.mongodb.net/blogapp?retryWrites=true&w=majority&appName=Cluster0')
        console.log('Connected to mongo db')
    }catch(error)
    {
        console.log(error)
    }
};
module.exports=connectDB;