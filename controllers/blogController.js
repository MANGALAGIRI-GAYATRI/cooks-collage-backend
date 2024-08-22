const blogModel = require('../models/blogModel')
const userModel = require('../models/userModel')
const mongoose = require("mongoose")

exports.getAllBlogsController=async(req,res)=>{
    try{
        const blogs = await blogModel.find({}).populate('user');
        if(!blogs){
            return res.status(200).send({
                success:false,
                message:"No blogs found",
            })
        }
        return res.status(200).send({
            success:true,
            BlogCount:blogs.lenngth,
            message:"All Blogs lists",
            blogs,
        })
    }
    catch(error){
        console.log(error);
        return res.status(500).send({
            success:false,
            message:"Error while getting blogs",
            error,
        })
    }
};

exports.createBlogController= async (req,res) => {
    try{
        const { title,description,image,content,user} = req.body;
        if(!title || !description || !image ||!content||!user){
            return res.status(400).send({
                success:false,
                message:"Please provide all fields",
            })
        }
        const existingUser= await userModel.findById(user)
        if(!existingUser){
            return res.status(404).send({
                success:false,
                message:"unable to find user"
            })
        }

        const newBlog = new blogModel({title,description,image,content,user});
        const session = await mongoose.startSession()
        session.startTransaction()
        await newBlog.save({session})
        existingUser.blogs.push(newBlog)
        await existingUser.save({session})
        await session.commitTransaction()
        await newBlog.save();
        return res.status(201).send({
            success:true,
            message:"Blog Created",
            newBlog,
        })
    }catch(error){
        console.log(error);
        return res.status(400).send({
            success:false,
            message:"Error while creating blog",
            error,
        })
    }
};

exports.updateBlogController=async(req,res)=>{
    try{
        const {id} = req.params;
        const { title,description,image,content } =req.body;
        const blog = await blogModel.findByIdAndUpdate(
            id,
            {...req.body},
            {new:true}
        );
        return res.status(200).send({
            success:true,
            message:"blog updated",
            blog,
        });
    }catch(error){
        console.log(error);
        return res.status(400).send({
            success:false,
            message:"Error while updating blog",
            error,
        })
    }
};

exports.getBlogByIdController=async(req,res)=>{
    try{
        const {id} = req.params
        const blog = await blogModel.findById(id)
        if(!blog){
            return res.status(404).send({
                success:false,
                message:'blog not found with this is'
            })
        }
        return res.status(200).send({
            success:true,
            message:'fetch single blog',
            blog
        })
    }catch(error){
        console.log(error)
        return res.status(400).send({
            success:false,
            message:'error while getting single blog',
            error
        })
    }
};

exports.deleteBlogController=async(req,res)=>{
    try{
        const blog = await blogModel
        .findByIdAndDelete(req.params.id).populate("user");
        await blog.user.blogs.pull(blog);
        await blog.user.save();
        return res.status(200).send({
            success:true,
            message:'Blog Deleted'
        })
    }catch(error){
        console.log(error)
        return res.status(400).send({
            success:false,
            message:'Error while deleting Blog',
            error
        })
    }
};

//get for user blog
exports.userBlogController = async (req,res)=>{
    try{
        const userBlog = await userModel.findById(req.params.id).populate("blogs");
        if(!userBlog){
            return res.status(404).send({
                success:false,
                message:"blogs not found with this id",
            })
        }
        return res.status(200).send({
            success:true,
            message:"user blogs",
            userBlog,
        });
    }catch(error){
        console.log(error)
        return res.status(400).send({
            success:false,
            message:'error in user blog',
            error,
        })
    }
}

exports.commentBlogByIdController = async (req, res) => {
    try {
        const { id } = req.params;
        console.log((req.params))
        const { comment,username,Date} = req.body;
        console.log(req.body)
        //const username = localStorage.getItem('username');
        // console.log(comment)
        // console.log(username)
        // Check if the blog exists
        const blog = await blogModel.findById(id);
        if (!blog) {
            return res.status(404).send({
                success: false,
                message: 'Blog not found',
            });
        }

        // Add the comment to the blog
        blog.comment.push({ username: username , comment: comment ,createdAt: Date});
        console.log(blog);
        await blog.save();

        return res.status(200).send({
            success: true,
            message: 'Comment added to the blog',
            blog,
        });
    } catch (error) {
        console.log(error);
        return res.status(400).send({
            success: false,
            message: 'Error while adding comment to the blog',
            error,
        });
    }
};



// exports.commentBlogByIdController = async (req, res) => {
//     try {
//         //blog id
//         const { id } = req.params;
//         console.log(id)
//         const { comment, userId } = req.body;
//         // const { comment } = req.body;
//         // console.log(req.session.userId)
//         // const userId = req.session.userId;
//         //const user = await userModel.findById(req.user._id);
//         //console.log(user)
//         //console.log(req.user)
//         // Get the authenticated user's ID
//         // const userId = req.body;
//         // console.log(req.body);
//         // console.log("*****")
//         // console.log(userId)
//         // Find the authenticated user in the UserModel to retrieve the username
//         //const user = await userModel.findById(userId);
//         // if (!user) {
//         //     return res.status(404).send({
//         //         success: false,
//         //         message: 'User not found',
//         //     });
//         // }
//         // Check if the blog exists
//         const blog = await blogModel.findById(id);
//         if (!blog) {
//             return res.status(404).send({
//                 success: false,
//                 message: 'Blog not found',
//             });
//         }

//         // Add the comment to the blog
//         blog.comment.push({ text: comment, userId: userId });
//         await blog.save();

//         return res.status(200).send({
//             success: true,
//             message: 'Comment added to the blog',
//             blog,
//         });
//     } catch (error) {
//         console.log(error);
//         return res.status(400).send({
//             success: false,
//             message: 'Error while adding comment to the blog',
//             error,
//         });
//     }
// };




// // exports.commentBlogByIdController = async (req, res) => {
// //     try {
// //         const { id } = req.params;
// //         const { comment } = req.body;

// //         const username = userModel.find(req.params.username);

// //         // Check if the blog exists
// //         const blog = await blogModel.findById(id);
// //         if (!blog) {
// //             return res.status(404).send({
// //                 success: false,
// //                 message: 'Blog not found',
// //             });
// //         }

// //         // Add the comment to the blog
// //         blog.comment.push({ text: comment ,username: username });
// //         await blog.save();

// //         return res.status(200).send({
// //             success: true,
// //             message: 'Comment added to the blog',
// //             blog,
// //         });
// //     } catch (error) {
// //         console.log(error);
// //         return res.status(400).send({
// //             success: false,
// //             message: 'Error while adding comment to the blog',
// //             error,
// //         });
// //     }
// // };