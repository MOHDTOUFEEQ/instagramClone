# 🚀 **Instagram Clone - Social Media Platform**

A feature-rich social media platform built with **React.js**, **Tailwind CSS**, and **Appwrite**. This project mimics Instagram’s core features, including user authentication, photo sharing, chatting, search, and more. It provides a modern, interactive UI combined with a solid backend using **Appwrite** for seamless data management and user interaction.

## 📌 **Features**
- **User Authentication**: Secure sign-up, sign-in, and profile management.
- **Post Creation & Sharing**: Users can upload, edit, and share images or videos.
- **Real-Time Chat**: Integrated chatting feature for instant messaging.
- **Search Functionality**: Search for users, posts, or hashtags to easily discover content.
- **Responsive UI**: A modern and sleek interface, fully responsive, powered by **Tailwind CSS**.
- **Backend Managed with Appwrite**: Handles authentication, database, and file storage to ensure smooth user experience.

## 📈 **How to Use**

1. Clone the repository:
   ```bash
   git clone https://github.com/MOHDTOUFEEQ/instagramClone.git
2. Install dependencies:
   ```bash
    cd myblogs
    npm install
3. Run the development server:
    ```bash
    npm run dev
    ```

## 🖼️ **Image preview (Appwrite free tier)**

For post and profile images to load, your Appwrite storage bucket must allow **public read** access (works on the free tier):

1. Open **Appwrite Console** → **Storage** → select your bucket.
2. Go to **Settings** (or **Permissions**).
3. Under **Permissions**, add: **Role** `Any` with **Read** access.
4. Save.

After this, `getFileView` URLs will load in the browser without authentication and images will display correctly.
