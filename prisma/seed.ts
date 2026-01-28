import { PrismaClient } from '@prisma/client'
import { Pool } from 'pg'
import { PrismaPg } from '@prisma/adapter-pg'
import fs from 'fs/promises'
import path from 'path'
import 'dotenv/config'

const connectionString = process.env.DIRECT_URL || process.env.DATABASE_URL
const pool = new Pool({ connectionString })
const adapter = new PrismaPg(pool)
const prisma = new PrismaClient({ adapter })

async function main() {
  const dataPath = path.join(process.cwd(), 'data', 'characters.json')
  
  try {
    const data = await fs.readFile(dataPath, 'utf-8')
    const characters = JSON.parse(data)

    console.log(`Seeding ${characters.length} characters...`)

    for (const char of characters) {
      // Use upsert to avoid duplicates if re-run
      await prisma.character.upsert({
        where: { id: char.id },
        update: {
            name: char.name,
            anime: char.anime,
            type: char.type,
            desc: char.desc,
            image: char.image,
            rank: char.rank,
            objectPosition: char.objectPosition
        },
        create: {
            id: char.id, // Keep original ID
            name: char.name,
            anime: char.anime,
            type: char.type,
            desc: char.desc,
            image: char.image,
            rank: char.rank,
            objectPosition: char.objectPosition || "center center"
        },
      })
    }

    console.log('Seeding completed successfully.')
  } catch (error) {
    console.error('Error seeding database:', error)
  }
}

main()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (e) => {
    console.error(e)
    await prisma.$disconnect()
    process.exit(1)
  })
