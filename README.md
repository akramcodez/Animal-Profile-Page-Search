# 🐾 Animalgram  

A responsive demo of an **animal profile page** that allows users to browse, search, and interact with animal profiles.  
**Inspired by Instagram!**

## 🎉 Welcome to Animalgram  

A fun social media platform for pets! This web application lets users explore animal profiles, such as:  
**CAT | DOG | GOAT | COW | HEN | DUCK | HORSE**

Each profile showcases unique bios, posts, and user interactions.

---

## 🤝 Collaboration Project  

**Animalgram** is an open-source collaboration project. We welcome contributions from developers around the world. Whether you're adding features, fixing bugs, or improving the design, your input is valuable.  
**Please create a separate branch and push your changes before submitting a pull request.**

---

## 🛠️ Technologies Used  

- **Frontend**: EJS, CSS  
- **Backend**: Node.js, Express.js  
- **Data Storage**: JSON file (`data.json`)  
- **Package Manager**: npm  

---

## 🚀 Usage  

- Users can explore various animal profiles and engage with posts.  
- **Profiles** include unique bios and images, which can be edited at any time.  
- Posts can be **deleted** to maintain an organized feed.  
- User interactions feature **likes and comments** to enhance engagement.  
- The **Home Page** displays recent activities, trending profiles, and quick updates via stories.  
- A **search function** enables users to find profiles easily, with helpful suggestions based on their input.

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

- **[SK Akram](https://github.com/akramcodez)** :  
  Worked on: **User Profiles**, **Posts**, **Responsive Design**, **Sidebar Navigation**.

- **[Rajat Mishra](https://github.com/mishraRj)** :  
  Worked on: **Profile Editing**, **Post Deletion**.

- **[Abijit Swain](https://github.com/Abhijit8951)** :  
  Worked on: **Home Page**, **Routing**.

- **[Himanshu](https://github.com/Himanshu19-coder)** :  
  Worked on: **Search Functionality and Suggestions**.

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

# Step 7: After making changes, commit, push, and submit a pull request:
git add .
git commit -m "Enhanced functionality"
git push origin <your-branch-name>

# The application will be available at:
# 👉 http://localhost:8080
