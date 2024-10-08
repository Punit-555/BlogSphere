import axios from "axios"
import { toast } from "react-toastify";
const token = localStorage.getItem("access_token");


const createPost = async (payload) => {
    try {
        const response = await axios.post(`http://localhost:8080/posts/create`, payload, {
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            }
        }

        );
        return response;
    } catch (error) {
        console.error('Error signing up user:', error);
        throw error;
    }
}

const allPostsByUser = async (userId) => {

    try {
        const response = await axios.post(
            `${process.env.REACT_APP_BASE_URL}/posts/postByUser`,
            {
                id: userId
            },
            {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            }
        );
        return response?.data;
    } catch (error) {
        console.error('Error fetching posts by user:', error);
        return error;
    }
};


const deletePost = async (id) => {
    try {
        const response = await axios.delete(
            `${process.env.REACT_APP_BASE_URL}/posts/delete/${id}`,
            {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            }
        );
        return response?.data;
    } catch (error) {
        console.error('Error fetching posts by user:', error);
        return error;
    }
}

const updateUser = async (payload) => {
    try {
        const response = await axios.post(`${process.env.REACT_APP_BASE_URL}/updateUser/${payload?.id}`, {
            ...payload.formData
        }, {
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            }
        }

        );
        return response;
    } catch (error) {
        console.error('Error signing up user:', error);
        throw error;
    }
}

const searchPosts = async (payload) => {
    try {
        const response = await axios.post(`${process.env.REACT_APP_BASE_URL}/posts/search-posts`, {
            searchType: payload?.selectedCategory,
            searchValue: payload.enteredValue
        }, {
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            }
        }

        );
        return response;
    } catch (error) {
        console.error('Error signing up user:', error);
        throw error;
    }
}


const blogDetails = async (id) => {
    try {
        const response = await axios.post(
            `${process.env.REACT_APP_BASE_URL}/posts/post-details/${id}`,
        );
        // console.log("ABOOOOO", response);
        return response;
    } catch (error) {
        console.error('Error fetching posts by user:', error);
        return error;
    }
}


const updatePost = async (id, formData) => {
    try {
        const response = await axios.put(`${process.env.REACT_APP_BASE_URL}/posts/update/${id}`, {
            title: formData.title || "",
            content: formData.content || "",
            category: formData.category || ""
        }, {
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            }
        }

        );
        return response;
    } catch (error) {
        console.error('Error signing up user:', error);
        throw error;
    }
}


// LIKE USER 

const likedPost = async (userId, postId) => {
    try {
        const response = await axios.post(`${process.env.REACT_APP_BASE_URL}/post/likes&comment/like`, {
            "user_id": userId,
            "post_id": postId
        }, {
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            }
        }
        );
        toast.success(response?.data);
        return response;
    } catch (error) {
        console.error('Error signing up user:', error);
        throw error;
    }
}


const addComment = async (userId, postId, content) => {
    try {
        const response = await axios.post(`${process.env.REACT_APP_BASE_URL}/posts/comment`, {
            "user_id": userId,
            "post_id": postId,
            "content": content
        }, {
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            }
        }
        );
        toast.success(response?.data);
        return response;
    } catch (error) {
        console.error('Error signing up user:', error);
        throw error;
    }
}


export { addComment, createPost, allPostsByUser, deletePost, updateUser, searchPosts, blogDetails, updatePost, likedPost };