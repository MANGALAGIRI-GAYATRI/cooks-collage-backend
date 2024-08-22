const express = require('express')
const {
    getAllBlogsController,
    createBlogController,
    updateBlogController,
    getBlogByIdController,
    deleteBlogController,
    userBlogController,
    commentBlogByIdController
} = require("../controllers/blogController");

const router = express.Router()

//get - all blogs
router.get('/all-blogs', getAllBlogsController)

//post - create blogs
router.post('/create-blog', createBlogController)

//put - update blog
router.put('/update-blog/:id', updateBlogController)

//get - single blog details
router.get('/get-blog/:id', getBlogByIdController)

//delete - delete blog
router.delete('/delete-blog/:id', deleteBlogController)

//get - user blog
router.get('/user-blog/:id', userBlogController)

router.post('/add-comment/:id', commentBlogByIdController)
router.post('/blog-content', getAllBlogsController)

module.exports = router