# 🚀 PixelWalk  

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

###🔹 2️⃣ Install Dependencies
```sh
npm install
```

###🔹 3️⃣ Set Up Environment Variables
Create a .env.local file and add the required credentials:

```
mkdir .env
NEXT_PUBLIC_CONVEX_URL=<your-convex-url>
NEXT_PUBLIC_API_KEY=<your-api-key>
```

###🔹 4️⃣ Run the Development Server
```
npm run dev
```
Visit http://localhost:3000 in your browser to explore PixelWalk.



##🔥 Convex Setup
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
3️⃣ Deploy Your First Convex Functions
```npx convex push
```

4️⃣ Start Using Convex in Code
Inside your Next.js project, import and use Convex:
```
import { useMutation, useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";

const messages = useQuery(api.messages.list);
const sendMessage = useMutation(api.messages.send);
```

5️⃣ Deploy Your App with Convex
```
Once everything is set up, deploy your Convex backend:
npx convex deploy
```
Now, your Convex-powered database is ready to handle real-time data updates.

#📁 Folder Structure
```csharp
pixelwalk/
│── public/            # Static assets
├── convex/        # Convex backend logic
│── src/
│   ├── components/    # Reusable UI components
│   ├── app/           # Next.js pages
│   ├── lib/           # Custom function and utils 
│   ├── /        # Tailwind styles
│── .env.local         # Environment variables
│── package.json       # Project dependencies
│── README.md          # Project documentation
```

#🤝 Contributing
We welcome contributions! Follow these steps:

1️⃣ Fork the repository
2️⃣ Create a feature branch (git checkout -b feature-name)
3️⃣ Commit your changes (git commit -m "Added new feature")
4️⃣ Push to your branch (git push origin feature-name)
5️⃣ Open a pull request

📩 Contact
💡 Have ideas, feedback, or questions? Connect with us!

📧 Email: prathameshgursal42@gmail.com
🌐 Website: PixelWalk
