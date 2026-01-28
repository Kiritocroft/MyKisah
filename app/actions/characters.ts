"use server";

import fs from "fs/promises";
import path from "path";
import { revalidatePath } from "next/cache";
import { v4 as uuidv4 } from "uuid";
import { type Character } from "@/types";
import { prisma } from "@/lib/prisma";
import { supabase } from "@/lib/supabase";

const UPLOAD_DIR = path.join(process.cwd(), "public", "uploads", "characters");

// Helper to check if string is a URL
const isUrl = (str: string) => {
    try {
        new URL(str);
        return true;
    } catch {
        return false;
    }
};

async function ensureUploadDir() {
  try {
    await fs.access(UPLOAD_DIR);
  } catch {
    await fs.mkdir(UPLOAD_DIR, { recursive: true });
  }
}

async function uploadToSupabase(file: File, filename: string) {
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    const { data, error } = await supabase.storage
        .from('characters')
        .upload(filename, buffer, {
            contentType: file.type,
            upsert: true
        });

    if (error) throw error;

    const { data: { publicUrl } } = supabase.storage
        .from('characters')
        .getPublicUrl(filename);
        
    return publicUrl;
}

export async function getCharacters(): Promise<{ characters: Character[]; error?: string }> {
  try {
    const characters = await prisma.character.findMany({
      orderBy: {
        rank: 'asc',
      },
    });
    return { characters };
  } catch (error) {
    console.error("Error reading characters:", error);
    return { characters: [], error: "Failed to load characters" };
  }
}

import { z } from "zod";

const CharacterSchema = z.object({
  name: z.string().min(1, "Name is required").max(100),
  anime: z.string().min(1, "Anime is required").max(100),
  type: z.enum(["Waifu", "Husbu", "Other"]).default("Waifu"),
  desc: z.string().max(1000).optional(),
  rank: z.number().int().min(1).max(100).optional(),
  objectPosition: z.string().optional(),
});

export async function saveCharacter(formData: FormData) {
  try {
    const rawData = {
        name: formData.get("name"),
        anime: formData.get("anime"),
        type: formData.get("type"),
        desc: formData.get("desc"),
        rank: formData.get("rank") ? parseInt(formData.get("rank") as string) : undefined,
        objectPosition: formData.get("objectPosition"),
    };

    console.log("Processing Save Character:", JSON.stringify(rawData, null, 2));

    // Validate input using Zod
    const validatedData = CharacterSchema.parse(rawData);

    const id = formData.get("id") ? parseInt(formData.get("id") as string) : null;
    const imageFile = formData.get("image") as File | null;
    
    let imagePath = formData.get("existingImage") as string || "✿"; // Default fallback

    if (imageFile && imageFile.size > 0) {
        // Validate file type and size
        if (!imageFile.type.startsWith("image/")) {
            throw new Error("Invalid file type. Only images are allowed.");
        }
        if (imageFile.size > 5 * 1024 * 1024) { // 5MB limit
            throw new Error("File size too large. Max 5MB.");
        }

        // Try Supabase upload first
        try {
            const filename = `${uuidv4()}${path.extname(imageFile.name)}`;
            imagePath = await uploadToSupabase(imageFile, filename);
        } catch (storageError) {
            console.error("Supabase storage upload failed, falling back to local:", storageError);
            
            // Fallback to local storage
            await ensureUploadDir();
            const buffer = Buffer.from(await imageFile.arrayBuffer());
            const filename = `${uuidv4()}${path.extname(imageFile.name)}`;
            const filepath = path.join(UPLOAD_DIR, filename);
            await fs.writeFile(filepath, buffer);
            imagePath = `/uploads/characters/${filename}`;
        }
    }

    const characterData = {
        ...validatedData,
        desc: validatedData.desc || "", // Ensure desc is not undefined
        image: imagePath,
        rank: validatedData.rank || null,
        objectPosition: validatedData.objectPosition || "center center",
    };

    let deletedOldImage = false;

    if (id) {
      // Check for old image deletion if we are updating and have a new image
      const existingChar = await prisma.character.findUnique({ where: { id } });
      
      if (existingChar && imageFile && imageFile.size > 0) {
         // User is uploading a new image
         if (existingChar.image) {
             // If old image is on Supabase
             if (isUrl(existingChar.image) && existingChar.image.includes('supabase.co')) {
                 const oldPath = existingChar.image.split('/').pop();
                 if (oldPath) {
                    await supabase.storage.from('characters').remove([oldPath]);
                 }
             }
             // If old image is local
             else if (existingChar.image.startsWith("/uploads/characters/")) {
                 try {
                     const oldFilePath = path.join(process.cwd(), "public", existingChar.image);
                     try {
                        await fs.access(oldFilePath);
                        await fs.unlink(oldFilePath);
                        deletedOldImage = true;
                     } catch (accessErr) {
                        console.log(`[File Deletion] File not found: ${existingChar.image}`);
                     }
                 } catch (e) {
                     console.error(`[File Deletion Error] Failed to delete ${existingChar.image}:`, e);
                 }
             }
         }
      }

      // Update existing
      await prisma.character.update({
        where: { id },
        data: characterData,
      });
    } else {
      // Create new
      await prisma.character.create({
        data: characterData,
      });
    }

    revalidatePath("/");
    revalidatePath("/admin/characters");
    return { success: true, deletedOldImage };
  } catch (error) {
    console.error("Error saving character:", error);
    return { error: "Failed to save character" };
  }
}

export async function deleteCharacter(id: number) {
  try {
    const charToDelete = await prisma.character.findUnique({ where: { id } });
    
    if (charToDelete && charToDelete.image) {
        // Delete from Supabase
        if (isUrl(charToDelete.image) && charToDelete.image.includes('supabase.co')) {
            const oldPath = charToDelete.image.split('/').pop();
             if (oldPath) {
                await supabase.storage.from('characters').remove([oldPath]);
             }
        }
        // Delete from local
        else if (charToDelete.image.startsWith("/uploads/")) {
            try {
                const filePath = path.join(process.cwd(), "public", charToDelete.image);
                await fs.unlink(filePath);
            } catch (e) {
                console.error("Error deleting image file:", e);
            }
        }
    }

    await prisma.character.delete({ where: { id } });
    
    revalidatePath("/");
    revalidatePath("/admin/characters");
    return { success: true };
  } catch (error) {
    console.error("Error deleting character:", error);
    return { error: "Failed to delete character" };
  }
}
