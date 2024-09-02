// routes/postRoutes.js
const express = require('express');
const router = express.Router();
const postController = require('../controllers/postControllers');
const authMiddleware = require('../middleware/authMiddleware');


// All Posts 
router.get('/all-posts', postController.getAllPosts);

// Create Posts 
router.post('/create', authMiddleware, postController.createPost);

// find Posts 
// router.get('/postByID/:id', authMiddleware, postController.getPostById);

// find Posts by User 
router.post('/postByUser', authMiddleware, postController.getPostByUser);

// update Posts 
router.put('/posts/:id', authMiddleware, postController.updatePost);

// delete Posts 
router.delete('/delete/:id', authMiddleware, postController.deletePost);

router.post("/search-posts", postController.searchPosts);


module.exports = router;
