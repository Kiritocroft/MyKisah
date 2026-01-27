# My Kisah 🌸

A beautiful, interactive personal showcase website built with **Next.js 16** and **React 19**, featuring 3D elements, smooth animations, and a comprehensive admin management system with advanced image editing capabilities.

## 📸 Preview

<!-- Ganti link gambar di bawah ini dengan URL screenshot aplikasi Anda -->

<div align="center">
  <img src="https://via.placeholder.com/800x450?text=Home+Page+Preview" alt="Home Page" width="100%" />
  <br>
  <em>Interactive 3D Landing Page</em>
</div>

<br>

<div align="center">
  <img src="https://via.placeholder.com/800x450?text=Admin+Panel+Preview" alt="Waifu Gallery" width="100%" />
  <br>
  <em>Waifu Gallery</em>
</div>

## ✨ Features

### 🎨 Public Interface
- **Interactive 3D Model**: Features a stunning 3D model with 360° rotation controls and interactions, powered by React Three Fiber.
- **Hall of Fame**: A podium-style showcase for top-ranked characters with a symmetric, premium layout.
- **Waifu Gallery**: A dynamic, filterable gallery of characters with categories like "Wholesome" and "Energetic".
- **Immersive Design**: Dark mode aesthetic with floating sakura particles, glassmorphism effects, and custom typography.
- **Smooth Animations**: Powered by Framer Motion for delightful page transitions and scroll reveals.

### 🛠️ Admin Panel
- **Secure Authentication**: Session-based login protection for administrative access.
- **Character Management**: Full CRUD operations for the character gallery.
- **Advanced Image Editor**: 
  - Integrated cropping tool with zoom, rotation, and aspect ratio controls.
  - **Auto-Cleanup**: Automatically deletes old, unused character images from the server to optimize storage.
- **Real-time Feedback**: Toast notifications for actions like saving, deleting, and error handling.

## 🚀 Tech Stack

- **Framework**: [Next.js 16](https://nextjs.org/) (App Router)
- **Core**: [React 19](https://react.dev/)
- **Styling**: [Tailwind CSS 4](https://tailwindcss.com/)
- **3D Graphics**: [React Three Fiber](https://docs.pmnd.rs/react-three-fiber) & [Drei](https://github.com/pmndrs/drei)
- **Animations**: [Framer Motion](https://www.framer.com/motion/)
- **Image Processing**: [React Easy Crop](https://github.com/ricardo-ch/react-easy-crop)
- **Icons**: [Lucide React](https://lucide.dev/)

## 🛠️ Getting Started

### Prerequisites
- Node.js (v18 or higher recommended) installed on your machine.

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

```
/app
  ├── /actions       # Server Actions for Auth and Data mutations
  ├── /admin         # Protected Admin panel routes
  │   ├── /characters  # Character management with Image Editor
  │   └── /login       # Admin authentication
  ├── /api           # API Routes
  └── page.tsx       # Main Landing Page
/components
  ├── /ImageAdvancedEditor.tsx  # Custom Image Cropper Component
  ├── /WaifuCard.tsx            # 3D Tilt Character Card
  └── ...
/data                # JSON based storage for simplicity
/public
  ├── /uploads       # Dynamically uploaded character images
  └── ...
```

## � Credits

- **Kaoruko Waguri 3D Model**: Special thanks to **nezunyann** for providing the amazing 3D character model used in this project.

## �📝 License

This project is created for educational and personal showcase purposes.

---
*Built with ❤️ by Kiritocroft*
