import axios from "axios"
const token = localStorage.getItem("access_token");
const userData = JSON?.parse(localStorage.getItem("user_details"));
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

const getSpecificUserDetails = async (id) => {
    try {
        const response = await axios.get(`${process.env.REACT_APP_BASE_URL}/userDetails/${id}`, {
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            }
        }
        );
        return response?.data;
    } catch (error) {
        console.error(error);
        return error;
    }
}


const fetchUpdatedUserDetails = async () => {
    try {
        const res = await getSpecificUserDetails(userData?.id);
        return res[0];
    } catch (error) {
        console.log(error);
    }
};


export { allPosts, getSpecificUserDetails, fetchUpdatedUserDetails };