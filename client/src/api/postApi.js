import axios from "axios"
const token = localStorage.getItem("access_token");
const createPost = async (payload) => {
    const token = localStorage.getItem("access_token");
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


export { createPost, allPostsByUser, deletePost };