//import  "../data/versions.json";
import "../../data/versions.json";

export const getVersions = async () => {
    try {
        const response = await fetch(`/api/versions`);
        if (!response.ok)
            throw new Error(`HTTP error! status: ${response.status}`);
        return await response.json();
    } catch (error) {
        console.error("Failed to fetch versions:", error);
        return null;
    }
};
