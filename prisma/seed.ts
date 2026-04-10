import 'dotenv/config'
import { PrismaClient } from '../app/generated/prisma'
import { PrismaNeon } from '@prisma/adapter-neon'
import { neon } from '@neondatabase/serverless'

const sql = neon(process.env.DATABASE_URL!)
const adapter = new PrismaNeon({ connectionString: process.env.DATABASE_URL! })
const prisma = new PrismaClient({ adapter })

async function main() {

  console.log('🌱 Starting seed...')

  // -----------------------------
  // 1. Clean database
  // -----------------------------

  await prisma.game.deleteMany()
  await prisma.console.deleteMany()

  console.log('🧹 Database cleaned')

  // -----------------------------
  // 2. Create Consoles
  // -----------------------------

  const consoles = await prisma.console.createMany({
    data: [
      {
        name: 'PlayStation 5',
        manufacturer: 'Sony Interactive Entertainment',
        releasedate: new Date('2020-11-12'),
        description:
          'The PlayStation 5 (PS5) is a home video game console bringing 4K gaming at 120Hz and ray tracing support.',
      },
      {
        name: 'Xbox Series X',
        manufacturer: 'Microsoft',
        releasedate: new Date('2020-11-10'),
        description:
          'The Xbox Series X is a high-performance console, featuring a custom AMD processor and 12 TFLOPS of graphical power.',
      },
      {
        name: 'Nintendo Switch OLED Model',
        manufacturer: 'Nintendo',
        releasedate: new Date('2021-10-08'),
        description:
          'A hybrid console that can be used as a home console and a portable handheld device, now with a vibrant OLED screen.',
      },
      {
        name: 'Nintendo Switch 2',
        manufacturer: 'Nintendo',
        releasedate: new Date('2025-06-05'),
        description:
          'The successor to the popular Nintendo Switch, featuring larger magnetic Joy-cons and enhanced performance.',
      },
      {
        name: 'Steam Deck OLED',
        manufacturer: 'Valve',
        releasedate: new Date('2023-11-16'),
        description:
          'A powerful handheld gaming computer that plays PC games from your Steam library on the go.',
      },
    ],
  })

  console.log('🎮 5 consoles seeded')

  // -----------------------------
  // 3. Get consoles from DB
  // -----------------------------

  const allConsoles = await prisma.console.findMany()

  const ps5 = allConsoles.find(c => c.name === 'PlayStation 5')
  const xbox = allConsoles.find(c => c.name === 'Xbox Series X')
  const switchOLED = allConsoles.find(c => c.name === 'Nintendo Switch OLED Model')
  const switch2 = allConsoles.find(c => c.name === 'Nintendo Switch 2')
  const steamDeck = allConsoles.find(c => c.name === 'Steam Deck OLED')

  // -----------------------------
  // 4. Create Games
  // -----------------------------

  const gamesData = [
    {
      title: 'God of War Ragnarök',
      developer: 'Santa Monica Studio',
      releasedate: new Date('2022-11-09'),
      price: 69.99,
      genre: 'Action-adventure',
      description:
        'Kratos and Atreus must journey to each of the Nine Realms and find answers as the forces of Asgard prepare for a prophesied battle.',
      console_id: ps5!.id,
    },
    {
      title: 'Halo Infinite',
      developer: '343 Industries',
      releasedate: new Date('2021-12-08'),
      price: 59.99,
      genre: 'First-person shooter',
      description:
        'Master Chief returns in the most expansive Halo campaign yet.',
      console_id: xbox!.id,
    },
    {
      title: 'The Legend of Zelda: Tears of the Kingdom',
      developer: 'Nintendo EPD',
      releasedate: new Date('2023-05-12'),
      price: 69.99,
      genre: 'Action-adventure',
      description:
        'Link soars through the skies and explores new areas of Hyrule.',
      console_id: switchOLED!.id,
    },
    {
      title: 'Elden Ring',
      developer: 'FromSoftware',
      releasedate: new Date('2022-02-25'),
      price: 59.99,
      genre: 'Action role-playing',
      description:
        'A fantasy action RPG adventure set within a world created by Hidetaka Miyazaki.',
      console_id: ps5!.id,
    },
    {
      title: 'Forza Horizon 5',
      developer: 'Playground Games',
      releasedate: new Date('2021-11-09'),
      price: 59.99,
      genre: 'Racing',
      description:
        'Explore the vibrant open world landscapes of Mexico.',
      console_id: xbox!.id,
    },
    {
      title: 'Pokémon Scarlet',
      developer: 'Game Freak',
      releasedate: new Date('2022-11-18'),
      price: 59.99,
      genre: 'Role-playing',
      description:
        'Embark on a new journey in the Paldea region.',
      console_id: switchOLED!.id,
    },
    {
      title: 'Spider-Man 2',
      developer: 'Insomniac Games',
      releasedate: new Date('2023-10-20'),
      price: 69.99,
      genre: 'Action-adventure',
      description:
        'Peter Parker and Miles Morales face the Symbiote threat.',
      console_id: ps5!.id,
    },
    {
      title: 'Starfield',
      developer: 'Bethesda Game Studios',
      releasedate: new Date('2023-09-06'),
      price: 69.99,
      genre: 'Role-playing',
      description:
        'Explore the vastness of space and create your own story.',
      console_id: xbox!.id,
    },
    {
      title: 'Mario Kart 9',
      developer: 'Nintendo EPD',
      releasedate: new Date('2025-12-01'),
      price: 59.99,
      genre: 'Racing',
      description:
        'The next installment in the popular Mario Kart series.',
      console_id: switch2!.id,
    },
    {
      title: 'Hogwarts Legacy',
      developer: 'Avalanche Software',
      releasedate: new Date('2023-02-10'),
      price: 59.99,
      genre: 'Action role-playing',
      description:
        'Experience a new story set in the wizarding world.',
      console_id: steamDeck!.id,
    },
    {
      title: 'Call of Duty Modern Warfare II',
      developer: 'Infinity Ward',
      releasedate: new Date('2022-10-28'),
      price: 69.99,
      genre: 'First-person shooter',
      description: 'A global conflict featuring Task Force 141 in a new era of warfare.',
      console_id: ps5!.id,
    },
    {
      title: 'Resident Evil 4 Remake',
      developer: 'Capcom',
      releasedate: new Date('2023-03-24'),
      price: 59.99,
      genre: 'Survival horror',
      description: 'Leon Kennedy returns in a reimagined survival horror classic.',
      console_id: ps5!.id,
    },
    {
      title: 'FIFA 23',
      developer: 'EA Sports',
      releasedate: new Date('2022-09-30'),
      price: 59.99,
      genre: 'Sports',
      description: 'Experience the world’s game with realistic football gameplay.',
      console_id: ps5!.id,
    },
    {
      title: 'NBA 2K24',
      developer: 'Visual Concepts',
      releasedate: new Date('2023-09-08'),
      price: 59.99,
      genre: 'Sports',
      description: 'Play as your favorite NBA stars in this realistic basketball sim.',
      console_id: xbox!.id,
    },
    {
      title: 'Assassin’s Creed Mirage',
      developer: 'Ubisoft',
      releasedate: new Date('2023-10-05'),
      price: 49.99,
      genre: 'Action-adventure',
      description: 'Return to the roots of Assassin’s Creed in Baghdad.',
      console_id: ps5!.id,
    },
    {
      title: 'Cyberpunk 2077',
      developer: 'CD Projekt',
      releasedate: new Date('2020-12-10'),
      price: 49.99,
      genre: 'Role-playing',
      description: 'A futuristic RPG set in Night City full of action and choices.',
      console_id: xbox!.id,
    },
    {
      title: 'Red Dead Redemption 2',
      developer: 'Rockstar Games',
      releasedate: new Date('2018-10-26'),
      price: 39.99,
      genre: 'Action-adventure',
      description: 'An epic tale of life in America’s unforgiving heartland.',
      console_id: xbox!.id,
    },
    {
      title: 'The Witcher 3',
      developer: 'CD Projekt',
      releasedate: new Date('2015-05-19'),
      price: 29.99,
      genre: 'Role-playing',
      description: 'Become a monster hunter in a vast open world.',
      console_id: ps5!.id,
    },
    {
      title: 'Battlefield 2042',
      developer: 'DICE',
      releasedate: new Date('2021-11-19'),
      price: 49.99,
      genre: 'First-person shooter',
      description: 'Massive battles in a near-future war setting.',
      console_id: xbox!.id,
    },
    {
      title: 'GTA V',
      developer: 'Rockstar Games',
      releasedate: new Date('2013-09-17'),
      price: 29.99,
      genre: 'Action-adventure',
      description: 'Three criminals navigate the underworld of Los Santos.',
      console_id: ps5!.id,
    },
    {
      title: 'Minecraft',
      developer: 'Mojang',
      releasedate: new Date('2011-11-18'),
      price: 26.99,
      genre: 'Sandbox',
      description: 'Build, explore, and survive in an infinite block world.',
      console_id: switchOLED!.id,
    },
    {
      title: 'Fortnite',
      developer: 'Epic Games',
      releasedate: new Date('2017-07-21'),
      price: 0,
      genre: 'Battle Royale',
      description: 'Fight to be the last one standing in this global phenomenon.',
      console_id: xbox!.id,
    },
    {
      title: 'Apex Legends',
      developer: 'Respawn Entertainment',
      releasedate: new Date('2019-02-04'),
      price: 0,
      genre: 'Battle Royale',
      description: 'Team-based battle royale with unique heroes.',
      console_id: ps5!.id,
    },
    {
      title: 'Overwatch 2',
      developer: 'Blizzard Entertainment',
      releasedate: new Date('2022-10-04'),
      price: 0,
      genre: 'Shooter',
      description: 'A team-based shooter with unique heroes and abilities.',
      console_id: xbox!.id,
    },
    {
      title: 'Dead Space Remake',
      developer: 'Motive Studio',
      releasedate: new Date('2023-01-27'),
      price: 59.99,
      genre: 'Survival horror',
      description: 'A terrifying sci-fi survival horror remake.',
      console_id: ps5!.id,
    },
    {
      title: 'Hades',
      developer: 'Supergiant Games',
      releasedate: new Date('2020-09-17'),
      price: 24.99,
      genre: 'Roguelike',
      description: 'Escape the underworld in this fast-paced action game.',
      console_id: switchOLED!.id,
    },
    {
      title: 'Celeste',
      developer: 'Matt Makes Games',
      releasedate: new Date('2018-01-25'),
      price: 19.99,
      genre: 'Platformer',
      description: 'Climb a mountain in this emotional platforming adventure.',
      console_id: switchOLED!.id,
    },
    {
      title: 'Cuphead',
      developer: 'Studio MDHR',
      releasedate: new Date('2017-09-29'),
      price: 19.99,
      genre: 'Platformer',
      description: 'A classic run and gun action game with cartoon visuals.',
      console_id: xbox!.id,
    },
    {
      title: 'Dark Souls III',
      developer: 'FromSoftware',
      releasedate: new Date('2016-04-12'),
      price: 39.99,
      genre: 'Action RPG',
      description: 'A challenging dark fantasy RPG experience.',
      console_id: ps5!.id,
    },
    {
      title: 'Sekiro Shadows Die Twice',
      developer: 'FromSoftware',
      releasedate: new Date('2019-03-22'),
      price: 59.99,
      genre: 'Action-adventure',
      description: 'A shinobi’s quest for revenge in feudal Japan.',
      console_id: xbox!.id,
    },
    {
      title: 'Ghost of Tsushima',
      developer: 'Sucker Punch',
      releasedate: new Date('2020-07-17'),
      price: 59.99,
      genre: 'Action-adventure',
      description: 'A samurai fights to defend Tsushima Island.',
      console_id: ps5!.id,
    },
    {
      title: 'Death Stranding',
      developer: 'Kojima Productions',
      releasedate: new Date('2019-11-08'),
      price: 49.99,
      genre: 'Action',
      description: 'Reconnect a fractured world in this unique experience.',
      console_id: ps5!.id,
    },
    {
      title: 'No Man’s Sky',
      developer: 'Hello Games',
      releasedate: new Date('2016-08-09'),
      price: 39.99,
      genre: 'Exploration',
      description: 'Explore an infinite procedurally generated universe.',
      console_id: xbox!.id,
    },
    {
      title: 'Terraria',
      developer: 'Re-Logic',
      releasedate: new Date('2011-05-16'),
      price: 14.99,
      genre: 'Sandbox',
      description: 'Dig, fight, explore, and build in a 2D world.',
      console_id: switchOLED!.id,
    },
    {
      title: 'Among Us',
      developer: 'InnerSloth',
      releasedate: new Date('2018-06-15'),
      price: 4.99,
      genre: 'Party',
      description: 'Find the impostor among your crew.',
      console_id: switchOLED!.id,
    },
    {
      title: 'Fall Guys',
      developer: 'Mediatonic',
      releasedate: new Date('2020-08-04'),
      price: 0,
      genre: 'Party',
      description: 'Compete in chaotic obstacle courses.',
      console_id: ps5!.id,
    },
    {
      title: 'Rocket League',
      developer: 'Psyonix',
      releasedate: new Date('2015-07-07'),
      price: 0,
      genre: 'Sports',
      description: 'Soccer with rocket-powered cars.',
      console_id: xbox!.id,
    },
    {
      title: 'Need for Speed Heat',
      developer: 'Ghost Games',
      releasedate: new Date('2019-11-08'),
      price: 39.99,
      genre: 'Racing',
      description: 'Race by day and risk it all by night.',
      console_id: ps5!.id,
    },
    {
      title: 'Gran Turismo 7',
      developer: 'Polyphony Digital',
      releasedate: new Date('2022-03-04'),
      price: 69.99,
      genre: 'Racing',
      description: 'A realistic driving simulator experience.',
      console_id: ps5!.id,
    },
    {
      title: 'Doom Eternal',
      developer: 'id Software',
      releasedate: new Date('2020-03-20'),
      price: 59.99,
      genre: 'Shooter',
      description: 'Rip and tear through demons at high speed.',
      console_id: xbox!.id,
    },
    {
      title: 'Control',
      developer: 'Remedy Entertainment',
      releasedate: new Date('2019-08-27'),
      price: 39.99,
      genre: 'Action',
      description: 'A supernatural adventure inside a secret agency.',
      console_id: ps5!.id,
    },
    {
      title: 'Alan Wake 2',
      developer: 'Remedy Entertainment',
      releasedate: new Date('2023-10-27'),
      price: 59.99,
      genre: 'Horror',
      description: 'A psychological horror thriller.',
      console_id: xbox!.id,
    },
    {
      title: 'Diablo IV',
      developer: 'Blizzard Entertainment',
      releasedate: new Date('2023-06-06'),
      price: 69.99,
      genre: 'Action RPG',
      description: 'Fight demons in a dark open world.',
      console_id: ps5!.id,
    },
    {
      title: 'Baldur’s Gate 3',
      developer: 'Larian Studios',
      releasedate: new Date('2023-08-03'),
      price: 69.99,
      genre: 'RPG',
      description: 'A deep story-driven RPG with choices that matter.',
      console_id: ps5!.id,
    },
    {
      title: 'Monster Hunter Rise',
      developer: 'Capcom',
      releasedate: new Date('2021-03-26'),
      price: 59.99,
      genre: 'Action RPG',
      description: 'Hunt massive monsters in a vibrant world.',
      console_id: switchOLED!.id,
    },
    {
      title: 'Splatoon 3',
      developer: 'Nintendo',
      releasedate: new Date('2022-09-09'),
      price: 59.99,
      genre: 'Shooter',
      description: 'Colorful team-based ink battles.',
      console_id: switchOLED!.id,
    },
    {
      title: 'Animal Crossing New Horizons',
      developer: 'Nintendo',
      releasedate: new Date('2020-03-20'),
      price: 59.99,
      genre: 'Simulation',
      description: 'Build your island life at your own pace.',
      console_id: switchOLED!.id,
    },
    {
      title: 'Super Smash Bros Ultimate',
      developer: 'Nintendo',
      releasedate: new Date('2018-12-07'),
      price: 59.99,
      genre: 'Fighting',
      description: 'All your favorite characters battle it out.',
      console_id: switchOLED!.id,
    }
  ]

  for (const game of gamesData) {
    if (!game.console_id) continue

    await prisma.game.create({
      data: game,
    })
  }

  console.log('🕹️ 50 games seeded')

  console.log('✅ Seed completed successfully')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })