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

// update Posts 
// router.put('/posts/:id', authMiddleware, postController.updatePost);

// delete Posts 
router.delete('/delete/:id', authMiddleware, postController.deletePost);

// post details 
router.post("/post-details/:id", postController.postDetails);



module.exports = router;
