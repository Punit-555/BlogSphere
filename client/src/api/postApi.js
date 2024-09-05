import axios from "axios"
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
    console.log("PAYLLLLL", id, formData);
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



export { createPost, allPostsByUser, deletePost, updateUser, searchPosts, blogDetails, updatePost };