import conf from '../conf/conf.js';
import { Client, Account, ID , Databases  , Storage ,Query} from "appwrite";


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

    async createAccount({email, password, name}) {
        try {
           const response =  await this.account.create(email, password, name);
                if (response) {
                    console.log("prblem after response");
                    try {
                        await this.databases.createDocument(
                            conf.appwriteDatabaseId,
                            conf.appwriteProfileCollectionId,
                            response.$id,
                            {
                                userID: response.$id,
                                userName: response.name,
                            }
                        );
                        return true;
                    } catch (error) {
                        console.log("error in storingUserInfo", error);
                    }
                }
        } catch (error) {
            throw error;
        }
    }
   
    async storingUserInfo({email, password, name}) {
        try {
           return  await this.account.create(ID.unique(), email, password, name);
        } catch (error) {
            throw error;
        }
    }
    async createPost({title,content,slug,status,featuredImage,userId ,username}){
        try {
            await this.databases.createDocument(
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
            )
            return true
        } catch (error) {
            console.log("error in storingUserInfo", error);
        }
    }
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
            console.log("error in storingUserInfo", error);
            // You may want to handle the error or rethrow it based on your requirements
            throw error;
        }
    }
    

    async login({email, password}) {
        try {
            return await this.account.createEmailSession(email, password);
        } catch (error) {
            throw error;
        }
    }

    async getCurrentUser() {
        try {
            return await this.account.get();
        } catch (error) {
            console.log("Appwrite serive :: getCurrentUser :: error", error);
        }

        return false;
    }

    async logout() {
        try {
            console.log("complteing");
            await this.account.deleteSessions();
            console.log("completed");
        } catch (error) {
            console.log("Appwrite serive :: logout :: error", error);
        }
    }
    async updatename(Name){
        try {
            return await this.account.updateName(Name);
        } catch (error) {
            console.log("error in update name", error);
        }
    }
    async updatemessage(slug,{message}){
        try {
            return await this.databases.updateDocument(
                conf.appwriteDatabaseId,
                conf.appwriteProfileCollectionId,
                slug,
            {
                messages: message
            }                
            )
        } catch (error) {
            console.log("error in create updatemessage", error);
        }
    }

    async updatePassword(...password){
        try {
            return await this.account.updateName(...password)
        } catch (error) {
            console.log("error in update name", error);
        }
    }
    async getFileDownloadURL(fileID) {
  try {
    const fileInfo = await this.bucket.getFile(
      conf.appwriteBucketId,
      fileID
    );

    // Check if the fileInfo contains the `$url` property
    if (fileInfo && fileInfo.$url) {
      return fileInfo.$url;
    } else {
      console.error("File URL not found in fileInfo");
      return null;
    }
  } catch (error) {
    console.log("error in getFileDownloadURL", error);
    return null;
  }
}

}

const authService = new AuthService();

export default authService

