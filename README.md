# 🚀 PixelWalk  
![image](https://github.com/user-attachments/assets/ecdd3d55-60e9-4e69-8606-6b3aa2d42825)

🌍 **PixelWalk** is an immersive virtual world where users can **create their own avatars**, **explore maps**, **interact with others**, and **chat in real-time with translation support**. Whether you want to **build new maps** or **roam freely**, PixelWalk makes it possible!  

🔗 **Live Demo:** [PixelWalk](https://pixcelwalk.vercel.app/)  

---

## ✨ Features  
- ✅ **Create Your Own Virtual Character** - Customize avatars to represent yourself in the virtual world.  
- ✅ **Explore & Build Maps** - Walk in existing maps or create new environments.  
- ✅ **Real-time Chat & Language Translation** - Chat with users and translate messages instantly.  
- ✅ **Interactive & Social** - Engage with others while navigating the virtual world.  
- ✅ **Smooth & Scalable** - Built with Next.js, TypeScript, and Convex for real-time updates.  

---

## 🛠️ Tech Stack  
- **Frontend:** Next.js (React Framework), TypeScript  
- **Backend:** Convex (Real-time Database & Backend)  
- **Hosting:** Vercel  
- **State Management:** React Hooks  
- **Styling:** Tailwind CSS  

---

## ⚡ Installation & Setup  

### 🔹 1️⃣ Clone the Repository  
```sh
git clone https://github.com/your-username/pixelwalk.git
cd pixelwalk
```

### 🔹 2️⃣ Install Dependencies
```sh
npm install
```

### 🔹 3️⃣ Set Up Environment Variables
Create a .env.local file and add the required credentials:
Add the Convex url and OpenAI API key
you can get your clerk credentials by following the steps in [ Clerk Documentation](https://docs.convex.dev/auth/clerk)
```
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=
CLERK_SECRET_KEY=
CONVEX_DEPLOYMENT=
NEXT_PUBLIC_CONVEX_URL=

```

### 🔹 4️⃣ Run the Development Server
```
npm run dev
```
Visit http://localhost:3000 in your browser to explore PixelWalk.



## 🔥 Convex Setup
Convex is used for real-time database, backend logic, and API handling.

🛠️ Steps to Set Up Convex
1️⃣ Install Convex CLI
```sh
npm install -g convex
```
2️⃣ Initialize Convex in Your Project
```
npx convex dev
```


