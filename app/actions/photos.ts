"use server";

import { revalidatePath } from "next/cache";
import fs from "fs/promises";
import path from "path";
import { v4 as uuidv4 } from "uuid";

const UPLOAD_DIR = path.join(process.cwd(), "public", "uploads");

// Ensure directory exists
async function ensureDir() {
  try {
    await fs.access(UPLOAD_DIR);
  } catch {
    await fs.mkdir(UPLOAD_DIR, { recursive: true });
  }
}

export type Photo = {
  name: string;
  path: string;
  size: number;
  uploadedAt: Date;
};

export async function uploadPhoto(formData: FormData) {
  await ensureDir();
  
  const file = formData.get("file") as File;
  if (!file) return { error: "No file provided" };
  
  if (!file.type.startsWith("image/")) {
      return { error: "File must be an image" };
  }

  const buffer = Buffer.from(await file.arrayBuffer());
  const ext = path.extname(file.name);
  const fileName = `${uuidv4()}${ext}`;
  const filePath = path.join(UPLOAD_DIR, fileName);
  
  try {
    await fs.writeFile(filePath, buffer);
    revalidatePath("/admin/photos");
    return { success: true };
  } catch (error) {
    return { error: "Failed to save file" };
  }
}

export async function getPhotos(): Promise<{ photos: Photo[], error?: string }> {
  await ensureDir();
  try {
    const files = await fs.readdir(UPLOAD_DIR);
    const photos = await Promise.all(
        files.map(async (file) => {
            const filePath = path.join(UPLOAD_DIR, file);
            const stats = await fs.stat(filePath);
            return {
                name: file,
                path: `/uploads/${file}`,
                size: stats.size,
                uploadedAt: stats.birthtime
            };
        })
    );
    // Sort by newest
    return { photos: photos.sort((a, b) => b.uploadedAt.getTime() - a.uploadedAt.getTime()) };
  } catch (error) {
    console.error("Error getting photos:", error);
    return { photos: [], error: "Failed to load photos" };
  }
}

export async function deletePhoto(fileName: string) {
    try {
        const filePath = path.join(UPLOAD_DIR, fileName);
        await fs.unlink(filePath);
        revalidatePath("/admin/photos");
        return { success: true };
    } catch (error) {
        return { error: "Failed to delete file" };
    }
}
