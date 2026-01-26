"use server";

import fs from "fs/promises";
import path from "path";
import { revalidatePath } from "next/cache";
import { v4 as uuidv4 } from "uuid";

const DATA_FILE = path.join(process.cwd(), "data", "characters.json");
const UPLOAD_DIR = path.join(process.cwd(), "public", "uploads", "characters");

export interface Character {
  id: number;
  name: string;
  anime: string;
  type: string;
  desc: string;
  image: string;
  rank?: number; // 1, 2, 3, or undefined/null
}

async function ensureDataFile() {
  try {
    await fs.access(DATA_FILE);
  } catch {
    await fs.mkdir(path.dirname(DATA_FILE), { recursive: true });
    await fs.writeFile(DATA_FILE, "[]", "utf-8");
  }
}

async function ensureUploadDir() {
  try {
    await fs.access(UPLOAD_DIR);
  } catch {
    await fs.mkdir(UPLOAD_DIR, { recursive: true });
  }
}

export async function getCharacters(): Promise<{ characters: Character[]; error?: string }> {
  try {
    await ensureDataFile();
    const data = await fs.readFile(DATA_FILE, "utf-8");
    const characters = JSON.parse(data);
    return { characters };
  } catch (error) {
    console.error("Error reading characters:", error);
    return { characters: [], error: "Failed to load characters" };
  }
}

export async function saveCharacter(formData: FormData) {
  try {
    await ensureDataFile();
    await ensureUploadDir();
    
    const data = await fs.readFile(DATA_FILE, "utf-8");
    let characters: Character[] = JSON.parse(data);

    const id = formData.get("id") ? parseInt(formData.get("id") as string) : null;
    const name = formData.get("name") as string;
    const anime = formData.get("anime") as string;
    const type = formData.get("type") as string;
    const desc = formData.get("desc") as string;
    const rank = formData.get("rank") ? parseInt(formData.get("rank") as string) : undefined;
    const imageFile = formData.get("image") as File | null;
    
    let imagePath = formData.get("existingImage") as string || "✿"; // Default fallback

    if (imageFile && imageFile.size > 0) {
        const buffer = Buffer.from(await imageFile.arrayBuffer());
        const filename = `${uuidv4()}${path.extname(imageFile.name)}`;
        const filepath = path.join(UPLOAD_DIR, filename);
        await fs.writeFile(filepath, buffer);
        imagePath = `/uploads/characters/${filename}`;
    }

    const characterData = {
        name,
        anime,
        type,
        desc,
        image: imagePath,
        rank: rank || undefined
    };

    if (id) {
      // Update existing
      characters = characters.map((c) => (c.id === id ? { ...c, ...characterData, id } : c));
    } else {
      // Create new
      const newId = characters.length > 0 ? Math.max(...characters.map((c) => c.id)) + 1 : 1;
      characters.push({ ...characterData, id: newId });
    }

    await fs.writeFile(DATA_FILE, JSON.stringify(characters, null, 2), "utf-8");
    revalidatePath("/");
    revalidatePath("/admin/characters");
    return { success: true };
  } catch (error) {
    console.error("Error saving character:", error);
    return { error: "Failed to save character" };
  }
}

export async function deleteCharacter(id: number) {
  try {
    await ensureDataFile();
    const data = await fs.readFile(DATA_FILE, "utf-8");
    let characters: Character[] = JSON.parse(data);
    
    // Delete associated image if it's a local file
    const charToDelete = characters.find(c => c.id === id);
    if (charToDelete && charToDelete.image.startsWith("/uploads/")) {
        try {
            const filePath = path.join(process.cwd(), "public", charToDelete.image);
            await fs.unlink(filePath);
        } catch (e) {
            console.error("Error deleting image file:", e);
        }
    }

    characters = characters.filter((c) => c.id !== id);
    
    await fs.writeFile(DATA_FILE, JSON.stringify(characters, null, 2), "utf-8");
    revalidatePath("/");
    revalidatePath("/admin/characters");
    return { success: true };
  } catch (error) {
    console.error("Error deleting character:", error);
    return { error: "Failed to delete character" };
  }
}
