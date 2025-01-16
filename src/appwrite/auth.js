import conf from '../conf/conf.js';
import { Client, Account, ID, Databases, Storage } from "appwrite";

export class AuthService {
    client = new Client();
    account;
    databases;
    bucket;
    
    constructor() {
        this.client
            .setEndpoint(conf.appwriteUrl)
            .setProject(conf.appwriteProjectId);
        this.account = new Account(this.client);
        this.databases = new Databases(this.client);
        this.bucket = new Storage(this.client);
    }

    // Create Account for the user
    async createAccount({ email, password, name }) {
        try {
            const response = await this.account.create(ID.unique(), email, password, name);
            if (response) {
                // Store the user profile
                await this.createPostProfile(response.$id, { userID: response.$id, userName: response.name });
                return response; // Return the user response or any data as needed
            }
        } catch (error) {
            console.log("Error in createAccount:", error);
            throw error; // Rethrow for higher-level handling
        }
    }

    // Store user info in the database after account creation
    async storingUserInfo({ email, password, name }) {
        try {
            const response = await this.account.create(ID.unique(), email, password, name);
            // Optionally, store the user in a database or other collection here.
            return response; // Return the response for further use if needed.
        } catch (error) {
            console.log("Error in storingUserInfo:", error);
            throw error;
        }
    }

    // Create a post with given details
    async createPost({ title, content, slug, status, featuredImage, userId, username }) {
        try {
            const response = await this.databases.createDocument(
                conf.appwriteDatabaseId,
                conf.appwriteCollectionId,
                slug,
                {
                    title,
                    content,
                    status,
                    featuredImage,
                    userId,
                    username,
                }
            );
            return response; // Return the response to know if the document creation was successful
        } catch (error) {
            console.log("Error in createPost:", error);
            throw error; // Rethrow for further handling
        }
    }

    // Create or update the user profile in the database
    async createPostProfile(paramID, { userID, userName }) {
        try {
            return await this.databases.createDocument(
                conf.appwriteDatabaseId,
                conf.appwriteProfileCollectionId,
                paramID,
                {
                    userID: userID,
                    userName: userName,
                }
            );
        } catch (error) {
            console.log("Error in createPostProfile:", error);
            throw error; // Propagate the error to handle it in the caller
        }
    }

    // Login the user using email and password
    async login({ email, password }) {
        try {
            return await this.account.createEmailSession(email, password);
        } catch (error) {
            console.log("Login failed:", error);
            throw new Error("Failed to login. Please check your credentials.");
        }
    }

    // Get the current logged-in user
    async getCurrentUser() {
        try {
            return await this.account.get();
        } catch (error) {
            console.log("Error in getCurrentUser:", error);
            throw new Error("Failed to fetch current user.");
        }
    }

    // Log out the current user
    async logout() {
        try {
            await this.account.deleteSessions();
            console.log("User logged out successfully.");
        } catch (error) {
            console.log("Error during logout:", error);
            throw new Error("Failed to log out.");
        }
    }

    // Update the user's name
    async updatename(Name) {
        try {
            return await this.account.updateName(Name);
        } catch (error) {
            console.log("Error in updateName:", error);
            throw new Error("Failed to update name.");
        }
    }

    // Update the user profile's message
    async updatemessage(slug, { message }) {
        try {
            return await this.databases.updateDocument(
                conf.appwriteDatabaseId,
                conf.appwriteProfileCollectionId,
                slug,
                {
                    messages: message
                }
            );
        } catch (error) {
            console.log("Error in updateMessage:", error);
            throw new Error("Failed to update message.");
        }
    }

    // Update the user's password
    async updatePassword(newPassword) {
        try {
            return await this.account.updatePassword(newPassword);
        } catch (error) {
            console.log("Error in updatePassword:", error);
            throw new Error("Failed to update password.");
        }
    }

    // Get the file download URL from Appwrite bucket
    async getFileDownloadURL(fileID) {
        try {
            const fileInfo = await this.bucket.getFile(conf.appwriteBucketId, fileID);

            // Check if the fileInfo contains the `$url` property
            if (fileInfo && fileInfo.$url) {
                return fileInfo.$url;
            } else {
                console.error("File URL not found in fileInfo");
                return null;
            }
        } catch (error) {
            console.log("Error in getFileDownloadURL:", error);
            return null;
        }
    }
}

const authService = new AuthService();

export default authService;
