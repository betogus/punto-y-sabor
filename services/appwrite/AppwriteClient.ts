import { Account, Avatars, Client, Databases, Storage } from "react-native-appwrite";

export const appwriteConfig = {
    endpoint: process.env.EXPO_PUBLIC_APPWRITE_ENDPOINT!,
    platform: "com.android.puntoysabor",
    projectId: process.env.EXPO_PUBLIC_APPWRITE_PROJECT_ID!,
    databaseId: "689e6bdb003860912805",
    bucketId: "68a661200036a0303bc1",
    userCollectionId: "689e6c7b0033221c1ec4",
    categoriesCollectionId: "68a6598c002b7acbf941",
    menuCollectionId: "68a65b8a001ff59a7976",
    customizationsCollectionId: "68a65de2001c8ddef094",
    menuCustomizationCollectionId: "68a65e7f001a1748ee15",
    subCategoriesCollectionId: "68acbc84002725207b84",
    relatedItemsCollectionId: "related_items"
};

export const client = new Client()
    .setEndpoint(appwriteConfig.endpoint)
    .setProject(appwriteConfig.projectId)
    .setPlatform(appwriteConfig.platform);

export const account = new Account(client);
export const databases = new Databases(client);
export const storage = new Storage(client);
export const avatars = new Avatars(client);