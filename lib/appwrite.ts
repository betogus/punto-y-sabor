import {Account, Avatars, Client, Databases, ID, Query} from 'react-native-appwrite';
import {CreateUserParams, SignInParams} from "@/type";

export const appWriteConfig = {
    endpoint: process.env.EXPO_PUBLIC_APPWRITE_ENDPOINT!,
    platform: "com.android.puntoysabor",
    projectId: process.env.EXPO_PUBLIC_APPWRITE_PROJECT_ID!,
    databaseId: "689e6bdb003860912805",
    userCollectionId: "689e6c7b0033221c1ec4"
}

export const client = new Client();

client.setEndpoint(appWriteConfig.endpoint!).setProject(appWriteConfig.projectId).setPlatform(appWriteConfig.platform);

export const account = new Account(client);
export const databases = new Databases(client);
const avatars = new Avatars(client);

export const createUser = async ({ email, password, name}: CreateUserParams) => {
    try {
        const newAccount = await account.create(ID.unique(), email, password, name);
        if (!newAccount) throw Error;
        await signIn({email, password});

        const avatarUrl = avatars.getInitialsURL(name);
        return await databases.createDocument(
            appWriteConfig.databaseId,
            appWriteConfig.userCollectionId,
            ID.unique(),
            { accountId: newAccount.$id, avatar: avatarUrl }
        );

    } catch (e) {
        throw new Error(e as string);
    }
}

export const signIn = async ({email, password}: SignInParams) => {
    try {
        const session = await account.createEmailPasswordSession(email, password);
    } catch (e) {
        throw new Error(e as string);
    }
}

export const getCurrentUser = async() => {
    try {
        const currentAccount = await account.get();
        if(!currentAccount) throw Error;

        const currentUser = await databases.listDocuments(
            appWriteConfig.databaseId,
            appWriteConfig.userCollectionId,
            [Query.equal('accountId', currentAccount.$id)]
        )
        if(!currentAccount) throw Error;

        return currentUser;
    } catch (e) {
        console.log(e)
        throw new Error(e as string);
    }
}
