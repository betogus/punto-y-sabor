import {appwriteConfig, databases} from "@/services/appwrite/AppwriteClient";

export const getCategories = async () => {
    const categories = await databases.listDocuments(
        appwriteConfig.databaseId,
        appwriteConfig.categoriesCollectionId
    );

    return categories.documents;
};