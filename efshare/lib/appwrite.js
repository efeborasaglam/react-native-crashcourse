import { Client, Account, Avatars, Databases, Query } from "react-native-appwrite";
import uuid from "react-native-uuid";

export const config = {
  endpoint: "https://cloud.appwrite.io/v1",
  platform: "com.jsm.efshare",
  projectId: "67d04cff0030e6f7de2f",
  databaseId: "67d04f480038d21fc72f",
  userCollectionId: "67d04f78003b4b9db6f2",
  videoCollectionId: "67d04f9e0022bffe5650",
  storageId: "67d051a2001565a0bd04",
};

// Init your React Native SDK
const client = new Client();

client
  .setEndpoint(config.endpoint) // Your Appwrite Endpoint
  .setProject(config.projectId) // Your project ID
  .setPlatform(config.platform); // Your application ID or bundle ID.

const account = new Account(client);
const avatars = new Avatars(client);
const databases = new Databases(client);

export const createUser = async (email, password, username) => {
  try {
    const newAccount = await account.create(
      uuid.v4(),
      email,
      password,
      username
    );

    if (!newAccount) throw Error;

    const avatarUrl = avatars.getInitials(username);

    await signIn(email, password);

    const newUser = await databases.createDocument(
      config.databaseId,
      config.userCollectionId,
      uuid.v4(),
      {
        accountId: newAccount.$id,
        email,
        username,
        avatar: avatarUrl,
      }
    );

    return newUser;
  } catch (error) {
    console.log(error);
    throw new Error(error);
  }
};

export async function signIn(email, password) {
  try {
    const session = await account.createEmailSession(email, password);
    return session;
  } catch (error) {
    throw new Error(error.message);
  }
}

export const getCurrentUser = async () => {
  try {
    const currentAccount = await account.get();
    if (!currentAccount) throw new Error("No active session found, creating a new one.");
    const currentUser = await databases.listDocuments(
      config.databaseId,
      config.userCollectionId,
      [Query.equal("accountId", currentAccount.$id)]
    );

    if (!currentUser) throw new Error("User not found.");

    return currentUser.documents[0];
  } catch (error) {
    if (error.message.includes("No active session found")) {
      // Handle redirection to login page if no active session is found
      router.replace('/sign-in');
    } else {
      console.log(error);
      throw new Error(error.message);
    }
  }
};