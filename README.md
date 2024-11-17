# 🐾 Anigram  

A **dynamic animal social media platform** where users can browse, search, and interact with animal profiles.  
**Inspired by Instagram!**

---

## 🎉 Welcome to Anigram  

A fun social media platform for pets! This web application lets users explore animal profiles, such as:  
**CAT | DOG | GOAT | COW | HEN | DUCK | HORSE**

Each profile showcases unique bios, posts, and user interactions.

---

## 🤝 Collaboration Project  

**Anigram** is an open-source collaboration project. We welcome contributions from developers around the world. Whether you're adding features, fixing bugs, or improving the design, your input is valuable.  
**Please create a separate branch and push your changes before submitting a pull request.**

---

## 🛠️ Technologies Used  

- **Frontend**: EJS, CSS  
- **Backend**: Node.js, Express.js  
- **Data Storage**: JSON file (`data.json`)  
- **Package Manager**: npm  

---

## 🚀 Usage  

- **Signup Page**: New users sign in on the root route (`/`), and on success, are redirected to the main page (`/ig`). They won’t see the signup page again unless the app is restarted.

- **Home Page**: Displays recent activities, trending profiles, and stories.

- **User Profiles**: Each animal profile has unique bios and posts.

- **New Post**: Users can create posts, which are added to `tiger247`'s section in `index.json`.

- **Settings**: Users can update bios, profile images, and display names.

- **Interactions**: Users can **like** and **comment** on posts.

- **Post Deletion**: Users can delete posts to manage their feed.

- **Search**: Search for profiles with dynamic suggestions.

- **Sidebar Navigation**: Provides quick access to home, profile, settings, and logout.

- **Error Handling**: Shows a "Post not found" page if the post is missing.

---

## 📂 Project Details  

- **Data Storage**: User profiles and posts are stored in `data.json`.  
- **Routing**: Profiles and pages are dynamically rendered using URLs (e.g., `/ig/:username` or `/ig`).  
- **Localhost**: Run the application on a localhost for development.

---

## 💡 Suggestions  

If the image URL from `data.json` isn't working:  
1. Open **Google** and search for an appropriate image.  
2. Copy the image URL.  
3. Replace the old URL in the `data.json` file with the new one.  
4. Restart the application to apply the changes.

---

## 👥 Contributors  

We appreciate the efforts and dedication of all contributors:

- **[Rajat Mishra](https://github.com/mishraRj)** :  
  Worked on **Profile Editing** and **Post Deletion**.

- **[Abijit Swain](https://github.com/Abhijit8951)** :  
  Worked on **Home Page** and **Routing**.

- **[Himanshu](https://github.com/Himanshu19-coder)** :  
  Worked on **Search Functionality, Suggestions, and Messaging**.

- **[SK Akram](https://github.com/akramcodez)** :  
  **Except for the above, everything else was developed by SK Akram**.  

---

## 👤 Author Information  

- **Name**: SK Akram  
- **Email**: skcodewizard786@gmail.com  
- **Social Media**:  
  - [Twitter](https://twitter.com/akramcodez)  
  - [LinkedIn](https://www.linkedin.com/in/sk-akram-aaa903318/)  
  - [Instagram](https://instagram.com/akramcodez)  
  - [YouTube](https://youtube.com/@akramcodez)  

---

## 📜 License  

This project is licensed under the **MIT License**.  

Permission is granted to use, copy, modify, and distribute this software for any purpose with or without fee, provided that the original copyright notice is included. [LICENSE](/LICENSE) 

**THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND.**

---

## ⚙️ Installation  

Follow these steps to set up the project locally:  

```bash
# Step 1: Clone the repository
git clone <repository-url>

# Step 2: Navigate into the project folder
cd <repository-folder>

# Step 3: Install dependencies
npm install

# Step 4: (Optional) Install Nodemon for automatic server restarts
npm i nodemon

# Step 5: Create a branch for your changes
git checkout -b <your-branch-name>

# Step 6: Run the application
node index.js

# The application will be available at:
# 👉 http://localhost:8080
