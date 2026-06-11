import axiosInstance from './axiosInstance';

export const getUserProfile = async () => {
    try {
        const response = await axiosInstance.get('/user/profile');
        return response.data;
    } catch (error) {
        console.error("Error fetching profile:", error);
        throw error;
    }
};