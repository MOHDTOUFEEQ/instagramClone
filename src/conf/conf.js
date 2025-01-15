const conf = {
    appwriteUrl : String(import.meta.env.VITE_APP_URL),
    appwriteProjectId : String(import.meta.env.VITE_APPWRITE_PROJECT_ID),
    appwriteDatabaseId : String(import.meta.env.VITE_APPWRITE_DATABASE_ID),
    appwriteCommentCollectionId : String(import.meta.env.VITE_APPWRITE_COMMENTCOLLECTION_ID),
    appwriteSavedCollectionId : String(import.meta.env.VITE_APPWRITE_SAVEDCOLLECTION_ID),
    appwriteProfileCollectionId : String(import.meta.env.VITE_APPWRITE_PROFILECOLLECTION_ID),
    appwriteMessagesCollectionId : String(import.meta.env.VITE_APPWRITE_MESSAGES_COLLECTION_ID),
    appwriteCollectionId : String(import.meta.env.VITE_APPWRITE_COLLECTION_ID),
    appwriteBucketId : String(import.meta.env.VITE_APPWRITE_BUCKET_ID),
}

export default conf
