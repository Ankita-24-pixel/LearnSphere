import axiosInstance from './axiosInstance'; // <-- Must use your instance!

// Upload Content (Links, PDFs, Videos)
export const uploadContent = async (contentData) => {
    try {

        const response = await axiosInstance.post('/content', contentData, {
            withCredentials: true
        });
        return response.data;
    } catch (error) {
        console.error("Error saving to database:", error);
        throw error;
    }
};
