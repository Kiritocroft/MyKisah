# 🌸 My Kisah

**My Kisah** is an interactive and aesthetic personal showcase website, built using the latest modern web technologies. This project features charming 3D characters, a dynamic "waifu" gallery, and a comprehensive admin panel for content management.

Crafted with love using **Next.js 16**, **React 19**, and **Tailwind CSS 4**, this website offers a seamless user experience with beautiful animations and high performance.

## 📸 Preview

<div align="center">
  <img src="https://i.imgur.com/NIMprFK.png" alt="Home Page" width="100%" />
  <br>
  <em>Interactive 3D Landing Page</em>
</div>

<br>

<div align="center">
  <img src="https://i.imgur.com/NMhFHjW.png" alt="Waifu Gallery" width="100%" />
  <br>
  <em>Waifu Gallery</em>
</div>

## ✨ Key Features

### 🎨 Public Interface
- **Interactive 3D Character**: Interact with a lively 3D model (click for voice/text response), powered by *React Three Fiber*.
- **Stunning Visual Effects**: Falling sakura particles, dynamic lighting effects, and smooth page transitions.
- **Hall of Fame**: A special podium to showcase the top 3 characters (Rank 1-3) with a premium design.
- **Waifu Gallery**: Explore the character collection with search and filter features (Waifu, Husbu, Others).
- **Responsive**: Optimal viewing experience on both desktop and mobile devices.

### 🛠️ Admin Panel
- **Character Management (CRUD)**: Easily add, edit, and delete characters.
- **Integrated Image Upload**: Upload images directly to **Supabase Storage** with local *fallback* support.
- **Security**: Admin login secured with *JWT Session* and *Middleware*.
- **Modern Database**: Utilizes **Supabase (PostgreSQL)** and **Prisma ORM** for reliable data management.

---

## 📋 Prerequisites

Before starting, ensure your computer has the following installed:

1.  **Node.js**: Version 18 or newer (v20+ recommended). [Download here](https://nodejs.org/).
2.  **Git**: For source code management. [Download here](https://git-scm.com/).
3.  **Supabase Account**: For free database and image storage. [Sign up here](https://supabase.com/).

---

## 🚀 Installation Guide (Step-by-Step)

Follow these steps to run the project on your local machine:

### 1. Clone Repository
Open your terminal (Command Prompt/PowerShell) and run the following command:

```bash
git clone https://github.com/Kiritocroft/MyKisah.git
cd MyKisah
```

### 2. Install Dependencies
Install all required project libraries:

```bash
npm install
```

### 3. Environment Configuration (.env)
Copy the example configuration file and create a new `.env` file:

```bash
cp .env.example .env
# Or on Windows (PowerShell):
# copy .env.example .env
```

Open the newly created `.env` file with your text editor and fill in the values:

-   `ADMIN_PASSWORD`: Password for admin panel login.
-   `DATABASE_URL`: Supabase database connection string (Transaction Mode - Port 6543).
-   `DIRECT_URL`: Supabase database connection string (Session Mode - Port 5432).
-   `NEXT_PUBLIC_SUPABASE_URL`: Your Supabase Project URL.
-   `NEXT_PUBLIC_SUPABASE_ANON_KEY`: Supabase public API key.
-   `SUPABASE_JWT_SECRET`: JWT secret key from Supabase API settings.

> **Tip:** You can get the database details and API keys in the Supabase dashboard under **Settings > Database** and **Settings > API**.

### 4. Database Setup
Run migrations to create tables in your Supabase database:

```bash
npx prisma migrate dev --name init
```

(Optional) Populate the database with initial data (seeding):

```bash
npm run seed
# or
npx tsx prisma/seed.ts
```

### 5. Run Application
Start the local development server:

```bash
npm run dev
```

Open your browser and access:
-   **Home Page**: [http://localhost:3000](http://localhost:3000)
-   **Admin Panel**: [http://localhost:3000/admin](http://localhost:3000/admin)

---

## 📂 Directory Structure

Here is a brief overview of the project folder structure:

```
MyKisah/
├── app/                  # Main Next.js App Router folder
│   ├── actions/          # Server Actions (backend logic)
│   ├── admin/            # Admin specific pages
│   ├── api/              # API Routes
│   └── page.tsx          # Home Page
├── components/           # React UI Components (Buttons, Cards, 3D Scene, etc.)
├── lib/                  # Configuration utilities (Prisma, Supabase)
├── prisma/               # Database Schema and Seed Scripts
├── public/               # Static files (Images, 3D Models)
└── types/                # TypeScript type definitions
```

---

## 🔧 Production Mode

To run the application in production mode (faster and more stable):

1.  **Build the application**:
    ```bash
    npm run build
    ```

2.  **Start the server**:
    ```bash
    npm start
    ```

The application will run at [http://localhost:3000](http://localhost:3000) with optimal performance.

---

## 🤝 How to Contribute

We are very open to contributions! If you want to add features or fix bugs:

1.  **Fork** this repository.
2.  Create a new **Branch** (`git checkout -b your-cool-feature`).
3.  Make changes and **Commit** (`git commit -m 'Add cool feature'`).
4.  **Push** to your branch (`git push origin your-cool-feature`).
5.  Create a **Pull Request** on GitHub.

---

## ❓ FAQ (Frequently Asked Questions)

**Q: Why can't I login to admin?**
A: Ensure you have set `ADMIN_PASSWORD` in the `.env` file and `SUPABASE_JWT_SECRET` matches the one in the Supabase dashboard.

**Q: Images are not showing after upload?**
A: Ensure a Storage Bucket named `characters` has been created in Supabase and its status is **Public**. Also check the *Policy* (RLS) in Storage to allow *Select*, *Insert*, *Update*, and *Delete*.

**Q: How to change the 3D model?**
A: Replace the `.glb` file in the `public/models/` folder and adjust the file reference in the `components/KaorukoModel.tsx` component.

---

Made with ❤️ by [Kiritocroft](https://github.com/Kiritocroft)
