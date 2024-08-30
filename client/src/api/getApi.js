import axios from "axios"

const allPosts = async () => {
    try {
        const response = await axios.get(
            `${process.env.REACT_APP_BASE_URL}/posts/all-posts`
        );
        return response.data;
    } catch (error) {
        console.error(error);
        return error;
    }
}


export { allPosts };