import { account, databases, avatars } from "./AppwriteClient";
import { ID, Query } from "react-native-appwrite";
import { CreateUserParams, SignInParams } from "@/type";
import {appwriteConfig} from "@/services/appwrite/AppwriteClient";

export const createUser = async ({ email, password, name }: CreateUserParams) => {
    const newAccount = await account.create(ID.unique(), email, password, name);
    if (!newAccount) throw new Error("Error creating account");

    await signIn({ email, password });

    const avatarUrl = avatars.getInitialsURL(name);

    return databases.createDocument(
        appwriteConfig.databaseId,
        appwriteConfig.userCollectionId,
        ID.unique(),
        { email, name, accountId: newAccount.$id, avatar: avatarUrl }
    );
};

export const signIn = async ({ email, password }: SignInParams) => {
    return account.createEmailPasswordSession(email, password);
};

export const getCurrentUser = async () => {
    const currentAccount = await account.get();
    if (!currentAccount) throw new Error("No current account");

    const currentUser = await databases.listDocuments(
        appwriteConfig.databaseId,
        appwriteConfig.userCollectionId,
        [Query.equal("accountId", currentAccount.$id)]
    );

    if (!currentUser) throw new Error("No user found");

    return currentUser.documents[0];
};
