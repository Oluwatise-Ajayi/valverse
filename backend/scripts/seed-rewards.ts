import { PrismaClient, MediaType } from '@prisma-local/client';
import { PrismaPg } from '@prisma/adapter-pg';
import { Pool } from 'pg';

// Initialize Prisma with adapter (matching your PrismaService setup)
const connectionString = process.env.DATABASE_URL || '';
const pool = new Pool({ connectionString });
const adapter = new PrismaPg(pool);

const prisma = new PrismaClient({ adapter });

async function main() {
    console.log('🌱 Seeding rewards...');

    // Scratch Card Compliments
    const compliments = [
        {
            title: 'Sweet Compliment #1',
            description: 'Your smile lights up my entire world! 🌍✨',
            type: MediaType.COMPLIMENT,
            requiredGame: 'scratch',
        },
        {
            title: 'Sweet Compliment #2',
            description: 'I fall for you more and more every single day 💕',
            type: MediaType.COMPLIMENT,
            requiredGame: 'scratch',
        },
        {
            title: 'Sweet Compliment #3',
            description: "You're my favorite person in the entire universe 🌟",
            type: MediaType.COMPLIMENT,
            requiredGame: 'scratch',
        },
        {
            title: 'Sweet Compliment #4',
            description: 'Every moment with you is a treasure I cherish 💎',
            type: MediaType.COMPLIMENT,
            requiredGame: 'scratch',
        },
        {
            title: 'Sweet Compliment #5',
            description: 'Your laugh is my favorite sound in the world 😄💖',
            type: MediaType.COMPLIMENT,
            requiredGame: 'scratch',
        },
    ];

    // Text Surprises
    const textRewards = [
        {
            title: 'Date Night Surprise! 🌹',
            description: 'Get ready for dinner at your favorite restaurant this Friday!',
            type: MediaType.TEXT,
            requiredGame: 'scratch',
        },
        {
            title: 'Weekend Getaway ✈️',
            description: 'Pack your bags! We\'re going somewhere special this weekend!',
            type: MediaType.TEXT,
            requiredGame: 'scratch',
        },
        {
            title: 'Movie Night 🎬',
            description: 'Movie marathon tonight with all your favorites + snacks!',
            type: MediaType.TEXT,
            requiredGame: 'scratch',
        },
    ];

    // Create compliments
    for (const compliment of compliments) {
        await prisma.media.create({
            data: {
                ...compliment,
                url: '',
                threshold: {},
            },
        });
        console.log(`✅ Created: ${compliment.title}`);
    }

    // Create text rewards
    for (const reward of textRewards) {
        await prisma.media.create({
            data: {
                ...reward,
                url: '',
                threshold: {},
            },
        });
        console.log(`✅ Created: ${reward.title}`);
    }

    console.log('\n🎉 Seeding complete! Created 8 rewards for scratch card.');
    console.log('🎮 Go play the Scratch Card to see your rewards!\n');
}

main()
    .catch((e) => {
        console.error('❌ Error seeding database:', e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
