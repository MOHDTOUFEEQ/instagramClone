import conf from "../conf/conf";
import { Client, Storage  , Databases, Query } from "appwrite";
 class Service2 {
    client = new Client();
    databases;
    bucket;
    constructor(){
        this.client
        .setEndpoint(conf.appwriteUrl)
    .setProject(conf.appwriteProjectId);
    this.databases = new Databases(this.client);
    this.bucket = new Storage(this.client);

    }

    async updateFollowers(slug, {Followers,followersList}) {
        try {
            return await this.databases.updateDocument(
            conf.appwriteDatabaseId,
            conf.appwriteProfileCollectionId,
            slug,
            {
                Followers,
                followersList,
            }
          );
        } catch (error) {
          console.error("Error updating Followers:", error);
        }
      }

    async updateFollowing(slug, {Following,followingList}) {
        try {
            return await this.databases.updateDocument(
            conf.appwriteDatabaseId,
            conf.appwriteProfileCollectionId,
            slug,
            {
              Following,
              followingList,
            }
          );
        } catch (error) {
          console.error("Error  update Following:", error);
        }
      }
    async updateProfilePic(slug,{ProfilePic}) {
        try {
            return await this.databases.updateDocument(
            conf.appwriteDatabaseId,
            conf.appwriteProfileCollectionId,
            slug,
            {
              ProfilePic,
            }
          );
        } catch (error) {
          console.error("Error  update Following:", error);
        }
      }
    async updateUserName(slug,{userName}) {
        try {
            return await this.databases.updateDocument(
            conf.appwriteDatabaseId,
            conf.appwriteProfileCollectionId,
            slug,
            {
              userName,
            }
          );
        } catch (error) {
          console.error("Error  update Following:", error);
        }
      }
    async updateBio(slug,{Bio}) {
        try {
            return await this.databases.updateDocument(
            conf.appwriteDatabaseId,
            conf.appwriteProfileCollectionId,
            slug,
            {
              Bio,
            }
          );
        } catch (error) {
          console.error("Error  update Following:", error);
        }
      }
      async getuser(searchValue) {
        try {
          const query = [Query.startsWith('userName', searchValue)];
          return await this.databases.listDocuments(
            conf.appwriteDatabaseId,
            conf.appwriteProfileCollectionId,
            query
          );
        } catch (error) {
          console.log("error in getuser", error);
        }
      }
      async getcurrUser(id) {
        try {
          const query = [Query.startsWith('userID', id)];
          return await this.databases.listDocuments(
            conf.appwriteDatabaseId,
            conf.appwriteProfileCollectionId,
            query
          );
        } catch (error) {
          console.log("error in getuser", error);
        }
      }
      async getFollowersList(id) {
        try {
          const query = [Query.equal('userID', id)];
          return await this.databases.listDocuments(
            conf.appwriteDatabaseId,
            conf.appwriteProfileCollectionId,
            query
          );
        } catch (error) {
          console.log("error in getuser", error);
        }
      }
      // async getFollowersList(id) {
      //   try {
      //     const query = [this.appwrite.query().equal('userID', id)];
      //     const options = {
      //       limit: 10,  
      //       offset: 0,
      //     };
      
      //     const result = await this.databases.listDocuments(
      //       conf.appwriteDatabaseId,
      //       conf.appwriteProfileCollectionId, 
      //       query,
      //       options
      //     );
      
      //     return result.documents;
      //   } catch (error) {
      //     console.log("Error in getFollowersList", error);
      //     throw error;
      //   }
      // }
      async getPostsForCurrentUserr(currentUserId) {
        try {
          const query = [
            Query.equal('userID', currentUserId), // You can include other conditions as needed
          ];
      
          return await this.databases.listDocuments(
            conf.appwriteDatabaseId,
            conf.appwriteProfileCollectionId,
            query,
          );
        } catch (error) {
          console.error('Error in getPostsForCurrentUser', error);
          throw error; // Rethrow the error to handle it in the calling code
        }
      }
}   


const service2 = new Service2()


export default service2