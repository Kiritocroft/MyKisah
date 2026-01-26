# My Kisah 🌸

A beautiful, interactive personal showcase website built with Next.js, featuring 3D elements, smooth animations, and a comprehensive admin management system.

## ✨ Features

- **Live Demo**: [https://my-kisah.vercel.app](https://my-kisah.vercel.app)
- **Preview Images**: 
  - ![Home Preview](https://via.placeholder.com/800x400?text=Home+Preview)
  - ![Ranking Preview](https://via.placeholder.com/800x400?text=3D+Model+Preview)
  - ![Gallery Preview](https://via.placeholder.com/800x400?text=Gallery+Preview)


### 🎨 Public Interface
- **Interactive 3D Model**: Features a 3D model of Kaoruko Waguri with 360° rotation controls and click interactions.
- **Waifu Gallery**: A curated gallery of favorite characters with "Wholesome" and "Energetic" categories.
- **Photo Gallery**: Masonry-style photo grid with lightbox view.
- **Immersive Design**: Dark mode aesthetic with floating sakura particles and candy-style typography (Fredoka font).
- **Smooth Animations**: Powered by Framer Motion for delightful transitions.

### 🛠️ Admin Panel (`/admin`)
- **Secure Authentication**: Session-based login protection.
- **Photo Management**: Upload, view, and delete photos for the public gallery.
- **Character Management**: Full CRUD (Create, Read, Update, Delete) operations for the Waifu Gallery.
- **Dashboard**: Centralized control for website content.

## 🚀 Tech Stack

- **Framework**: [Next.js 14](https://nextjs.org/) (App Router)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/)
- **3D Graphics**: [React Three Fiber](https://docs.pmnd.rs/react-three-fiber) & [Drei](https://github.com/pmndrs/drei)
- **Animations**: [Framer Motion](https://www.framer.com/motion/)
- **Font**: [Fredoka](https://fonts.google.com/specimen/Fredoka)
- **Icons**: [Lucide React](https://lucide.dev/)

## 🛠️ Getting Started

### Prerequisites
- Node.js installed on your machine.

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/Kiritocroft/MyKisah.git
   cd my-kisah
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Environment Setup**
   Create a `.env` file in the root directory to set your admin password:
   ```env
   ADMIN_PASSWORD=your_secure_password_here
   ```

4. **Run the development server**
   ```bash
   npm run dev
   ```

5. **Open the application**
   - Public site: [http://localhost:3000](http://localhost:3000)
   - Admin panel: [http://localhost:3000/admin](http://localhost:3000/admin)

## 📂 Project Structure

- `/app`: Next.js App Router pages and API actions.
  - `/actions`: Server Actions for Auth, Photos, and Characters.
  - `/admin`: Admin panel routes and components.
- `/components`: Reusable UI components (3D Scene, Galleries, UI elements).
- `/data`: JSON data storage for characters.
- `/public`: Static assets and uploaded photos.

## 📝 Use It For Fun :3