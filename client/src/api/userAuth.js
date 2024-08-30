import axios from "axios";


const signupUserAPI = async (payload) => {
    try {
        const response = await axios.post(`http://localhost:8080/signup`, payload);
        return response;
    } catch (error) {
        console.error('Error signing up user:', error);
        throw error;
    }
}
const loginUserAPI = async (payload) => {
    try {
        const response = await axios.post(`http://localhost:8080/login`, payload);
        return response;
    } catch (error) {
        console.error('Error signing up user:', error);
        throw error;
    }
}




export { signupUserAPI, loginUserAPI }; 