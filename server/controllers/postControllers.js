// controllers/postController.js
const db = require('../config/db');

// Get all posts (available to all users)
exports.getAllPosts = (req, res) => {
    const sql = `
        SELECT p.id AS post_id, 
               p.title, 
               p.content, 
               p.user_id, 
               p.created_at, 
               p.category,
               -- Count total likes for each post
               (SELECT COUNT(*) FROM likes l WHERE l.post_id = p.id) AS total_likes,
               -- Get all comments with user details for each post
               (SELECT JSON_ARRAYAGG(
                   JSON_OBJECT(
                       'comment_id', c.id,
                       'comment', c.content,
                       'user_id', u.id,
                       'user_name', u.name
                   )
               ) FROM comments c 
               JOIN users u ON c.user_id = u.id 
               WHERE c.post_id = p.id) AS comments
        FROM posts p
    `;

    db.query(sql, (err, results) => {
        if (err) return res.status(500).json({ error: err.message });

        res.json({ data: results });
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


exports.likePost = (req, res) => {
    const { user_id, post_id } = req.body;

    // Check if the user has already liked the post
    const checkLikeQuery = 'SELECT * FROM likes WHERE user_id = ? AND post_id = ?';

    db.query(checkLikeQuery, [user_id, post_id], (err, result) => {
        if (err) return res.status(500).send(err);

        if (result.length > 0) {
            // If the like exists, it means the user is disliking (removing the like)
            const dislikeQuery = 'DELETE FROM likes WHERE user_id = ? AND post_id = ?';
            db.query(dislikeQuery, [user_id, post_id], (err, deleteResult) => {
                if (err) return res.status(500).send(err);

                // Decrease the total likes count for the post
                const updateDislikesQuery = 'UPDATE posts SET total_likes = total_likes - 1 WHERE id = ?';
                db.query(updateDislikesQuery, [post_id], (err, updateResult) => {
                    if (err) return res.status(500).send(err);
                    res.send('Post disliked successfully');
                });
            });
        } else {
            const likeQuery = 'INSERT INTO likes (user_id, post_id) VALUES (?, ?)';
            db.query(likeQuery, [user_id, post_id], (err, insertResult) => {
                if (err) return res.status(500).send(err);

                // Increase the total likes count for the post
                const updateLikesQuery = 'UPDATE posts SET total_likes = total_likes + 1 WHERE id = ?';
                db.query(updateLikesQuery, [post_id], (err, updateResult) => {
                    if (err) return res.status(500).send(err);
                    res.send('Post liked successfully');
                });
            });
        }
    });
};


exports.totalLikePost = (req, res) => {
    const { post_id } = req.params;

    const query = 'SELECT COUNT(*) AS total_likes FROM likes WHERE post_id = ?';
    db.query(query, [post_id], (err, result) => {
        if (err) return res.status(500).send(err);
        res.json(result[0]);
    });
}

exports.commentPost = (req, res) => {
    const { user_id, post_id, content } = req.body;

    const query = 'INSERT INTO comments (user_id, post_id, content) VALUES (?, ?, ?)';
    db.query(query, [user_id, post_id, content], (err, result) => {
        if (err) return res.status(500).send(err);
        res.send('Comment added successfully');
    });
}


exports.allComments = (req, res) => {
    const { post_id } = req.params;

    const query = `
      SELECT c.id, c.content, c.created_at, u.name AS username
      FROM comments c
      JOIN users u ON c.user_id = u.id
      WHERE post_id = ?
      ORDER BY c.created_at DESC
    `;
    db.query(query, [post_id], (err, results) => {
        if (err) return res.status(500).send(err);
        res.json(results);
    });
}



// Post Details
exports.postDetails = (req, res) => {
    const { id } = req.params;

    // Query to fetch the post details along with comments and their user details
    const query = `
        SELECT p.id AS post_id,
               p.title,
               p.content,
               p.user_id AS post_user_id,
               p.created_at,
               p.category,
               u.name AS post_user_name,
               u.email AS post_user_email,
               u.phoneNumber AS post_user_phoneNumber,
               -- Get all comments with user details
               JSON_ARRAYAGG(
                   JSON_OBJECT(
                       'comment_id', c.id,
                       'comment', c.content,
                       'comment_user_id', cu.id,
                       'comment_user_name', cu.name,
                                              'comment_created_at', c.created_at

                   )
               ) AS comments,
               -- Count total likes
               (SELECT COUNT(*) FROM likes l WHERE l.post_id = p.id) AS total_likes
        FROM posts p
        JOIN users u ON p.user_id = u.id
        LEFT JOIN comments c ON p.id = c.post_id
        LEFT JOIN users cu ON c.user_id = cu.id
        WHERE p.id = ?
        GROUP BY p.id, u.id
    `;

    // Execute the query
    db.query(query, [id], (err, results) => {
        if (err) {
            console.error('Database error:', err);
            return res.status(500).json({ error: 'An error occurred while retrieving the post details.' });
        }

        // Check if the post exists
        if (results.length === 0) {
            return res.status(404).json({ message: 'Post not found' });
        }

        const postDetails = results[0];

        res.json(postDetails);
    });
};


