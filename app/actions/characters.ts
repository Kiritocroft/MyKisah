"use server";

import fs from "fs/promises";
import path from "path";
import { revalidatePath } from "next/cache";

const DATA_FILE = path.join(process.cwd(), "data", "characters.json");

export interface Character {
  id: number;
  name: string;
  anime: string;
  type: string;
  desc: string;
  image: string;
}

async function ensureDataFile() {
  try {
    await fs.access(DATA_FILE);
  } catch {
    await fs.mkdir(path.dirname(DATA_FILE), { recursive: true });
    await fs.writeFile(DATA_FILE, "[]", "utf-8");
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

export async function saveCharacter(character: Omit<Character, "id"> & { id?: number }) {
  try {
    await ensureDataFile();
    const data = await fs.readFile(DATA_FILE, "utf-8");
    let characters: Character[] = JSON.parse(data);

    if (character.id) {
      // Update existing
      characters = characters.map((c) => (c.id === character.id ? { ...c, ...character } as Character : c));
    } else {
      // Create new
      const newId = characters.length > 0 ? Math.max(...characters.map((c) => c.id)) + 1 : 1;
      characters.push({ ...character, id: newId });
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
