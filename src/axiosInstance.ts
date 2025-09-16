import axios from "axios";

const token = localStorage?.getItem("auth_token");
const axiosInstance = axios.create({
	baseURL: "http://localhost:5000/api/",
	headers: {
		Authorization: `Bearer ${token}`,
	},
});

export default axiosInstance;
