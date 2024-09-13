// routes/postRoutes.js
const express = require('express');
const router = express.Router();
const postController = require('../controllers/postControllers');
const authMiddleware = require('../middleware/authMiddleware');


// All Posts 
router.get('/all-posts', postController.getAllPosts);

// Create Posts 
router.post('/create', authMiddleware, postController.createPost);

// find Posts Details
router.post('/search-posts', postController.searchPosts);

// Find Posts by User 
router.post('/postByUser', authMiddleware, postController.getPostByUser);


// delete Posts 
router.delete('/delete/:id', authMiddleware, postController.deletePost);

// post details 
router.post("/post-details/:id", postController.postDetails);


// Update Post 
router.put("/update/:id", authMiddleware, postController.updatePost);


// likse  a post 
router.post("/like", authMiddleware, postController.likePost);

// get Total Liks on the Post 
router.get("/likes/:post_id", authMiddleware, postController.totalLikePost);

// add Comments 
router.post("/comment", authMiddleware, postController.commentPost);

// all Comments
router.post("/comments/:post_id", authMiddleware, postController.allComments);





module.exports = router;
