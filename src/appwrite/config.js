import conf from "../conf/conf";
import { Client, Storage , ID , Databases, Query } from "appwrite";
 class Service {
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
    async createPost({title= " ",featuredImage,userId ,username,ProfilePic}){
        try {
            await this.databases.createDocument(
                conf.appwriteDatabaseId,
                conf.appwriteCollectionId,
                ID.unique(),
            {
                title,
                featuredImage,
                userId,
                username,
                ProfilePic,
            }                
            )
            return true
        } catch (error) {
            console.log("error in create post", error);
        }
    }
    async createPost_video({title= " ",featuredVideo,userId ,username}){
        try {
            await this.databases.createDocument(
                conf.appwriteDatabaseId,
                conf.appwriteCollectionId,
                ID.unique(),
            {
                title,
                userId,
                username,
                featuredVideo,
            }                
            )
            return true
        } catch (error) {
            console.log("error in create post", error);
        }
    }
    async addComment({userName, content, timestamp,articles}) {
        try {
          // Assuming your comment table details are configured in conf
          await this.databases.createDocument(
            conf.appwriteDatabaseId,
            conf.appwriteCommentCollectionId,
            ID.unique(), // If you're letting Appwrite auto-generate the document ID
            {
                content,
                timestamp,
                userName,
                articles,
            } 
          );
      
          console.log("Comment added successfully");
        } catch (error) {
          console.error("Error adding comment:", error);
          throw error; // Rethrow the error to handle it in the calling code
        }
      }

      async addMessage({ userID, senderID, receiverID, messageContent, timestamp }) {
        try {
            // Assuming your messages table details are configured in conf
            return  await this.databases.createDocument(
                conf.appwriteDatabaseId,
                conf.appwriteMessagesCollectionId,
                ID.unique(), // If you're letting Appwrite auto-generate the document ID
                {
                    userID, // Assuming this is the foreign key indicating the user associated with the message
                    senderID,
                    receiverID,
                    messageContent,
                    timestamp,
                }
            );
    
        } catch (error) {
            console.error("Error adding message:", error);
            throw error; // Rethrow the error to handle it in the calling code
        }
    }
    async getMessages (senderID, receiverID) {
        try {
            const query = [
                Query.equal('senderID', senderID ), // You can include other conditions as needed
                Query.equal('receiverID', receiverID ), // You can include other conditions as needed
                ];
              return await this.databases.listDocuments(
                conf.appwriteDatabaseId,
                conf.appwriteMessagesCollectionId,
                query,
                10, // Limit the number of documents retrieved (adjust as needed)
                0,  // Skip the initial documents (adjust as needed)
                'timestamp', // Sort by timestamp (adjust as needed)
                'DESC' // Sort in descending order (adjust as needed)
              );
      
          
        } catch (error) {
          console.error("Error fetching messages:", error);
          throw error;
        }
      };

      async getComments(slug){
        try {
            const query = [
            Query.equal('$id', slug), // You can include other conditions as needed
            ];
            return await this.databases.getDocument(
                conf.appwriteDatabaseId,
                conf.appwriteCollectionId,
                query,                
            )
        } catch (error) {
            console.log("error in getpost", error);
        }
    }
    async updatePost(slug,{title,content,status,featuredImage}){
        try {
            return await this.databases.updateDocument(
                conf.appwriteDatabaseId,
                conf.appwriteCollectionId,
                slug,
            {
                title,
                content,
                status,
                featuredImage,
            }                
            )
        } catch (error) {
            console.log("error in create updatepost", error);
        }
    }
    async updateSaved(slug,{saved}){
        try {
            return await this.databases.updateDocument(
                conf.appwriteDatabaseId,
                conf.appwriteCollectionId,
                slug,
            {
                saved,
            }                
            )
        } catch (error) {
            console.log("error in create updatepost", error);
        }
    }
    async getProfileinfo(slug){
        try {
            return await this.databases.getDocument(
                conf.appwriteDatabaseId,
                conf.appwriteProfileCollectionId,
                slug,
            )
        } catch (error) {
            console.log("error in create getProfileInfo", error);
        }
    }
    async updateLikes(slug, { Likes, likedBy }) {
        try {
            return await this.databases.updateDocument(
            conf.appwriteDatabaseId,
            conf.appwriteCollectionId,
            slug,
            {
              Likes,
              likedBy,
            }
          );
        } catch (error) {
          console.error("Error updating likes:", error);
        }
      }

    async removeSavedPost(documentId) {
        try {
          // Assuming you have a "SavedPosts" collection in your database
          return await this.databases.deleteDocument(
            conf.appwriteDatabaseId,
            conf.appwriteSavedCollectionId,
            documentId
          );
        } catch (error) {
          console.error("Error saving/removing post:", error);
          throw error; // Rethrow the error to handle it in the calling code
        }
      }

    async deletePost(slug){
        try {
            return await this.databases.deleteDocument(
                conf.appwriteDatabaseId,
                conf.appwriteCollectionId,
                slug,                
            )
        } catch (error) {
            console.log("error in create deletepost", error);
        }
    }
    async getPost(slug){
        try {
            return await this.databases.getDocument(
                conf.appwriteDatabaseId,
                conf.appwriteCollectionId,
                slug,                
            )
        } catch (error) {
            console.log("error in getpost", error);
        }
    }
   async getSavedPost( userId ) {
      try {
        const query = [
          Query.equal('userId', userId),
          // You can include other conditions as needed
        ];
        const result = await this.databases.listDocuments(
          conf.appwriteDatabaseId,
          conf.appwriteSavedCollectionId,
          query
        );

        // Check if the result contains any documents
        if (result.documents.length > 0) {
          // Document exists
          return result.documents[0]; // You can return the document if needed
        } else {
          // Document does not exist
          return null;
        }
      } catch (error) {
        console.log("Error in getSavedPost:", error);
        throw error;
      }
}
    async getPosts(){
        try {
            return await this.databases.listDocuments(
                conf.appwriteDatabaseId,
                conf.appwriteCollectionId, 
            )
        } catch (error) {
            console.log("error in getposts", error);
        }
    }
    async getPostsForCurrentUser(currentUserId) {
        try {
          const query = [
            Query.equal('userId', currentUserId), // You can include other conditions as needed
          ];
      
          return await this.databases.listDocuments(
            conf.appwriteDatabaseId,
            conf.appwriteCollectionId,
            query,
          );
        } catch (error) {
          console.error('Error in getPostsForCurrentUser', error);
          throw error; // Rethrow the error to handle it in the calling code
        }
      }
    async uploadFile(file){
        try {
            return await this.bucket.createFile(
                conf.appwriteBucketId,
                ID.unique(),
                file 
            )
        } catch (error) {
            console.log("error in createFile", error);
        }
    }
    async deleteFile(fileID){
        try {
            return await this.bucket.deleteFile(
                conf.appwriteBucketId,    
                fileID
            )
        } catch (error) {
            console.log("error in deleteFile", error);
        }
    }
  
      
    getFilePreview(fileID){
        try {
            return  this.bucket.getFilePreview(
                conf.appwriteBucketId,    
                fileID
            )
        } catch (error) {
            console.log("error in getFilePreview", error);
        }
    }
    async getFileDownloadURL(fileID) {
        try {
          const fileInfo = await this.bucket.getFile(fileID);
          const downloadURL = fileInfo.$id
            ? `${conf.appwriteUrl}/v1/storage/files/${fileInfo.$id}/view`
            : null;
      
          if (downloadURL) {
            return new URL(downloadURL);
          } else {
            console.error("Download URL is null or undefined");
            return null;
          }
        } catch (error) {
          console.error("Error while getting file download URL:", error);
          return null;
        }
      }
      
    getFile(fileID){
        try {
            return  this.bucket.getFile(
                conf.appwriteBucketId,    
                fileID
            )
        } catch (error) {
            console.log("error in getFilePreview", error);
        }
    }
    
}   


const service = new Service()


export default service