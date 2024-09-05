// controllers/postController.js
const db = require('../config/db');

// Get all posts (available to all users)
exports.getAllPosts = (req, res) => {
    const sql = 'SELECT * FROM posts ';
    db.query(sql, (err, results) => {
        if (err) return res.status(500).json({ error: err.message });
        const data = {
            data: results
        }
        res.json(data);
    });
};


// Get a specific post by ID (available to all users)
exports.getPostById = (req, res) => {
    const { id } = req?.params;
    const firstQuery = `select * from  posts where id = ? `;
    db.query(firstQuery, [id], (err, userPosts) => {
        if (err) return res.status(500).json({ error: err.message });
        if (userPosts.length === 0) return res.status(404).json({ message: 'No posts found for this user' });
        const secondQuery = `SELECT * from users where id = ${userPosts?.id}`;
        const specificPostId = userPosts?.id;

        db.query(secondQuery, [specificPostId], (err, specificPost) => {
            if (err) return res.status(500).json({ error: err.message });
            if (specificPost.length === 0) return res.status(404).json({ message: 'Post not found' });

            res.json({
                user_details: userPosts,
                ...specificPost[0]

            });
        });
    });
};


// Get all  post created By User (available to all users)
exports.getPostByUser = (req, res) => {
    const { userId } = req.user;
    const sql = `SELECT * FROM  posts WHERE  user_id = ${userId} order by created_at desc  `;

    // Execute the query with parameterized id
    db.query(sql, [userId], (err, results) => {
        if (err) {
            console.error('Database error:', err);
            return res.status(500).json({ error: 'Internal server error' });
        }
        if (results.length === 0) {
            return res.status(404).json({ message: 'No posts found for this user' });
        }

        res.json(results);
    });
};

// Create a new post (only authenticated users)
exports.createPost = (req, res) => {
    const { title, content, category } = req.body;
    const userId = req.user.userId;

    if (!userId) {
        return res.status(400).json({ message: 'Invalid user. User not logged in or token missing.' });
    }
    const getUserQuery = 'SELECT id, email, name FROM users WHERE id = ?';
    const insertPostQuery = 'INSERT INTO posts (title,category, content, user_id) VALUES (?, ? , ?, ?)';

    db.query(getUserQuery, [userId], (err, userResults) => {
        if (err) {
            console.error('Error retrieving user:', err);
            return res.status(500).json({ error: err.message });
        }

        const user = userResults[0];
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        db.query(insertPostQuery, [title, category, content, userId], (err, results) => {
            if (err) {
                console.error('Error inserting post:', err);
                return res.status(500).json({ error: err.message });
            }

            const postId = results.insertId;

            res.status(201).json({
                message: 'Post created successfully',
                post: {
                    id: postId,
                    title,
                    category,
                    content,
                    userId,
                },
                user: {
                    id: user.id,
                    email: user.email,
                    name: user.name
                }
            });
        });
    });
};
// Update a post (only the user who created it)
exports.updatePost = (req, res) => {
    const { id } = req.params;
    const { title, content, category } = req.body;
    const userId = req.user.userId;


    const sql = `UPDATE posts SET title = ?, content = ?, category = ? WHERE id = ? AND user_id = ?`;

    db.query(sql, [title, content, category, id, userId], (err, results) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        if (results.affectedRows === 0) {
            return res.status(404).json({ message: 'Post not found or you do not have permission to update it!' });  // Handle case when post is not found or user is unauthorized
        }
        res.json({ message: 'Post updated successfully' });
    });
};

// Delete a post (only the user who created it)
exports.deletePost = (req, res) => {
    const { id } = req.params;
    const sql = 'DELETE FROM posts WHERE id = ? ';
    db.query(sql, [id], (err, results) => {
        if (err) return res.status(500).json({ error: err.message });
        if (results.affectedRows === 0) return res.status(404).json({ message: 'Post not found !' });
        res.json({ message: 'Post deleted' });
    });
};


exports.searchPosts = (req, res) => {
    const { searchType, searchValue } = req.body;

    // Base query to select posts and join with user details
    let query = `
      SELECT * from  posts 
     
    `;
    let queryParams = [];
    let conditions = [];

    if (searchValue) {
        if (searchType === 'title') {
            conditions.push('LOWER(posts.title) LIKE ?');
            queryParams.push(`%${searchValue.toLowerCase()}%`);
        } else if (searchType === 'category') {
            conditions.push('posts.category = ?');
            queryParams.push(searchValue);
        } else if (searchType === 'createdAt') {
            conditions.push('posts.created_at = ?');
            queryParams.push(searchValue);
        }
    }

    if (conditions.length > 0) {
        query += ' WHERE ' + conditions.join(' AND ');
    }


    db.query(query, queryParams, (err, results) => {
        if (err) {
            console.error('Error executing query:', err);
            return res.status(500).json({ error: 'Database query failed' });
        }

        // Return the results (posts with user details)
        res.json(results);
    });
};



// Post Details

exports.postDetails = (req, res) => {
    const { id } = req?.params;

    const query = `
        SELECT posts.*, users.*
        FROM posts
        JOIN users ON posts.user_id = users.id
        WHERE posts.id = ?
    `;

    db.query(query, [id], (err, results) => {
        if (err) {
            console.error('Database error:', err);
            return res.status(500).json({ error: err.message });
        }
        if (results.length === 0) {
            return res.status(404).json({ message: 'Post not found' });
        }


        const postDetails = results[0];

        res.json({ ...postDetails, postId: id });
    });
};


