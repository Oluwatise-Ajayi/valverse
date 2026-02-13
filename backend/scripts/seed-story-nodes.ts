import 'dotenv/config';
import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import { Pool } from 'pg';

// Initialize Prisma with adapter (matching your PrismaService setup)
const connectionString = (process.env.DATABASE_URL || '').replace('sslmode=require', '');
const pool = new Pool({
    connectionString,
    ssl: { rejectUnauthorized: false }
});
const adapter = new PrismaPg(pool);

const prisma = new PrismaClient({ adapter });

// Story Node Types
interface StoryOption {
    id: string;
    label: string;
    nextNode: string;
    effects: {
        trust?: number;
        closeness?: number;
        security?: number;
        desire?: number;
        confidence?: number;
    };
}

interface StoryNode {
    id: string;
    chapter: number;
    scene: number;
    text: string;
    options: StoryOption[];
}

// Chapter 1: "Outside My Door"
const chapter1Nodes: StoryNode[] = [
    // Scene 1 — The Knock
    {
        id: 'C1_S1',
        chapter: 1,
        scene: 1,
        text: `It was a normal day.
Then Teni knocked on my door.

"Bro, come out. Someone is here to see me."

I stepped outside…
and saw her.

Pretty. Calm. Standing like she belonged there.

My heart skipped.

I panicked.`,
        options: [
            {
                id: 'A',
                label: 'Run back inside',
                nextNode: 'C1_S2A',
                effects: {
                    closeness: -1,
                },
            },
            {
                id: 'B',
                label: 'Stay and greet her',
                nextNode: 'C1_S2B',
                effects: {
                    closeness: 2,
                },
            },
            {
                id: 'C',
                label: 'Smile awkwardly',
                nextNode: 'C1_S2C',
                effects: {
                    closeness: 1,
                },
            },
        ],
    },

    // Scene 2A — Panic Retreat
    {
        id: 'C1_S2A',
        chapter: 1,
        scene: 2,
        text: `I turned around and rushed back inside.

"Why am I blushing like this?"
I splashed water on my face.

After a minute… I gathered courage and came back out.`,
        options: [
            {
                id: 'A',
                label: 'Apologize for leaving',
                nextNode: 'C1_S3',
                effects: {
                    trust: 1,
                },
            },
            {
                id: 'B',
                label: 'Pretend nothing happened',
                nextNode: 'C1_S3',
                effects: {
                    trust: -1,
                },
            },
        ],
    },

    // Scene 2B — Brave Hello
    {
        id: 'C1_S2B',
        chapter: 1,
        scene: 2,
        text: `I stayed.

"Hi… I'm Tise."

She smiled.

"I'm Simi."

Her voice was soft.

I felt calmer.`,
        options: [
            {
                id: 'A',
                label: 'Compliment her',
                nextNode: 'C1_S3',
                effects: {
                    desire: 1,
                },
            },
            {
                id: 'B',
                label: 'Joke with Teni',
                nextNode: 'C1_S3',
                effects: {
                    closeness: 1,
                },
            },
        ],
    },

    // Scene 2C — Awkward Charm
    {
        id: 'C1_S2C',
        chapter: 1,
        scene: 2,
        text: `I smiled. Awkwardly.

She noticed.

"You're shy, abi?" she teased.

I laughed nervously.`,
        options: [
            {
                id: 'A',
                label: 'Admit it',
                nextNode: 'C1_S3',
                effects: {
                    trust: 1,
                },
            },
            {
                id: 'B',
                label: 'Play it cool',
                nextNode: 'C1_S3',
                effects: {
                    desire: 1,
                },
            },
        ],
    },

    // Scene 3 — Walk to the Bus Stop
    {
        id: 'C1_S3',
        chapter: 1,
        scene: 3,
        text: `We walked her to the bus stop.

Teni was talking.
I was mostly listening… to her.

The way she smiled.
The way she moved.

I wanted to know her more.`,
        options: [
            {
                id: 'A',
                label: 'Ask for her number',
                nextNode: 'C1_END',
                effects: {
                    closeness: 2,
                },
            },
            {
                id: 'B',
                label: 'Stay quiet',
                nextNode: 'C1_END',
                effects: {
                    closeness: -1,
                },
            },
            {
                id: 'C',
                label: 'Tell her "Nice meeting you"',
                nextNode: 'C1_END',
                effects: {
                    trust: 1,
                },
            },
        ],
    },

    // Chapter End
    {
        id: 'C1_END',
        chapter: 1,
        scene: 999, // Using 999 to indicate chapter end
        text: `As she entered the bus,
she waved.

Something started that day.

I didn't know it yet.

But my life was changing.`,
        options: [
            {
                id: 'A',
                label: 'Continue to Chapter 2',
                nextNode: 'C2_S1',
                effects: {},
            },
        ],
    },
];

// Chapter 2: "Almost Mine"
const chapter2Nodes: StoryNode[] = [
    // Scene 1 — Birthday Message
    {
        id: 'C2_S1',
        chapter: 2,
        scene: 1,
        text: `A few weeks later…

My phone buzzed.

"Happy Birthday 🎉"

It was from her. She got my number from Teni.

I smiled, but my mind was noisy.
Friends like Timi and Ope had warned me:
"Relax. You'll find your person. Don't misinterpret flags."`,
        options: [
            {
                id: 'A',
                label: 'Reply warmly',
                nextNode: 'C2_S2A',
                effects: {
                    closeness: 2,
                },
            },
            {
                id: 'B',
                label: 'Reply casually',
                nextNode: 'C2_S2B',
                effects: {
                    closeness: 1,
                },
            },
            {
                id: 'C',
                label: 'Overthink (Listen to friends)',
                nextNode: 'C2_S2C',
                effects: {
                    security: -1,
                },
            },
        ],
    },

    // Scene 2A — Late Night Chats
    {
        id: 'C2_S2A',
        chapter: 2,
        scene: 2,
        text: `We started talking.

One message became ten.
Ten became hours.

I was vulnerable.
I had recently gone through an emotional tug with someone close to me.
I was lonely. Needy.

Timi and Ope thought I was seeking validation.
"She has a boyfriend, Tise. If anything happens, she'll choose him."`,
        options: [
            {
                id: 'A',
                label: 'Ignore the doubt',
                nextNode: 'C2_S3',
                effects: {
                    trust: 2,
                },
            },
            {
                id: 'B',
                label: 'Worry about it',
                nextNode: 'C2_S3',
                effects: {
                    security: -1,
                },
            },
        ],
    },

    // Scene 2B — Friendly Distance
    {
        id: 'C2_S2B',
        chapter: 2,
        scene: 2,
        text: `I tried to keep it casual.
"Don't mistake her kindness for a green light," I told myself.

But she was the sensitive, playful type.
I was the teaser, the overthinker, the softie.

Our dynamic was undeniable.`,
        options: [
            {
                id: 'A',
                label: 'Lean into the dynamic',
                nextNode: 'C2_S3',
                effects: {
                    closeness: 1,
                },
            },
            {
                id: 'B',
                label: 'Guard your heart',
                nextNode: 'C2_S3',
                effects: {
                    security: 1,
                },
            },
        ],
    },

    // Scene 2C — Overthinking Spiral
    {
        id: 'C2_S2C',
        chapter: 2,
        scene: 2,
        text: `I typed. Deleted. Typed again.

Timi's voice in my head: "You're just lonely because of what happened with (my ex)."

But when I talked to Simi...
I felt safe.
Even when she didn't say much, just her presence made me know...
I wanted her.`,
        options: [
            {
                id: 'A',
                label: 'Admit you want her',
                nextNode: 'C2_S3',
                effects: {
                    desire: 2,
                },
            },
            {
                id: 'B',
                label: 'Suppress it',
                nextNode: 'C2_S3',
                effects: {
                    security: -1,
                },
            },
        ],
    },

    // Scene 3 — The Truth
    {
        id: 'C2_S3',
        chapter: 2,
        scene: 3,
        text: `She confirmed it eventually.
"I have a boyfriend."

My friends were right.
"See? She'll choose him," they'd say.

But it felt like I was begging for attention.
I was in emotional turmoil.`,
        options: [
            {
                id: 'A',
                label: 'Respect her relationship',
                nextNode: 'C2_S4A',
                effects: {
                    trust: 2,
                },
            },
            {
                id: 'B',
                label: 'Stay close anyway',
                nextNode: 'C2_S4B',
                effects: {
                    closeness: 2,
                },
            },
        ],
    },

    // Scene 4A — Healthy Boundaries
    {
        id: 'C2_S4A',
        chapter: 2,
        scene: 4,
        text: `I tried to pull back.
To stop "begging" for attention.

But I couldn't.
I needed to tell her.`,
        options: [
            {
                id: 'A',
                label: 'Write it down',
                nextNode: 'C2_S5',
                effects: {
                    trust: 1,
                },
            },
        ],
    },

    // Scene 4B — Emotional Risk
    {
        id: 'C2_S4B',
        chapter: 2,
        scene: 4,
        text: `I kept talking to her.
Falling for her.
Intently.

It was becoming too much to hold inside.`,
        options: [
            {
                id: 'A',
                label: 'Write it down',
                nextNode: 'C2_S5',
                effects: {
                    desire: 1,
                },
            },
        ],
    },

    // Scene 5 — The Epistle
    {
        id: 'C2_S5',
        chapter: 2,
        scene: 5,
        text: `I approached her about it.
I wrote a whole epistle.

Literally breaking down.
My fears. My turmoil with Dayo. My feelings for her.
Every vulnerability I had.

I sent it.`,
        options: [
            {
                id: 'A',
                label: 'Wait for reply',
                nextNode: 'C2_S6A',
                effects: {
                    trust: 3,
                    closeness: 2,
                },
            },
        ],
    },

    // Scene 6A — The Response
    {
        id: 'C2_S6A',
        chapter: 2,
        scene: 6,
        text: `She didn't know what to say at first.

But then...
She promised I didn't have to worry.

"You're not alone," she said.
"I'm here."

That made me feel at home.
That no matter how big my emotional turmoil got, I'd still have someone.`,
        options: [
            {
                id: 'A',
                label: 'Feel safe',
                nextNode: 'C2_END',
                effects: {
                    security: 3,
                    closeness: 3,
                },
            },
        ],
    },

    // Chapter End
    {
        id: 'C2_END',
        chapter: 2,
        scene: 999,
        text: `That night, I realized…

She wasn't just someone I liked.
She was my emotional home.

Even if she was still dating her babe.`,
        options: [
            {
                id: 'A',
                label: 'Continue to Chapter 3',
                nextNode: 'C3_S1',
                effects: {},
            },
        ],
    },
];

// Chapter 3: "Choose Me"
const chapter3Nodes: StoryNode[] = [
    // Scene 1 — Ikeja City Mall
    {
        id: 'C3_S1',
        chapter: 3,
        scene: 1,
        text: `September 25.
Teni's birthday.
Ikeja City Mall.

As much as we were celebrating Teni...
We had our own share of fun.

Music. Laughter.
And a bit of alcohol.`,
        options: [
            {
                id: 'A',
                label: 'Stay close to her',
                nextNode: 'C3_S2A',
                effects: {
                    closeness: 2,
                },
            },
            {
                id: 'B',
                label: 'Enjoy the vibe',
                nextNode: 'C3_S2A',
                effects: {
                    closeness: 1,
                },
            },
        ],
    },

    // Scene 2A — The First Kiss
    {
        id: 'C3_S2A',
        chapter: 3,
        scene: 2,
        text: `Under the influence...
High on the moment...

We found a moment.
And we had our first kiss.

It wasn't planned. But it happened.`,
        options: [
            {
                id: 'A',
                label: 'Hold the memory',
                nextNode: 'C3_S4',
                effects: {
                    desire: 3,
                },
            },
        ],
    },

    // Scene 4 — Advice From Friends
    {
        id: 'C3_S4',
        chapter: 3,
        scene: 4,
        text: `After that, the confusion hit.
She was still dating her babe.

I turned to my friends again.
Kcee. May. Akachi.
Layo. Anthony.

They offered their advice.
I had to make a move. I couldn't stay in limbo.`,
        options: [
            {
                id: 'A',
                label: 'Decide to ask her out',
                nextNode: 'C3_S5',
                effects: {
                    confidence: 2,
                },
            },
        ],
    },

    // Scene 5 — The Ultimatum
    {
        id: 'C3_S5',
        chapter: 3,
        scene: 5,
        text: `October 2.

She was at camp.
Not physically present.
We couldn't kiss or touch.

But via emails and cute messages...
I told her to choose.

"It's either me... or your uninvolved babe."`,
        options: [
            {
                id: 'A',
                label: 'Wait for her choice',
                nextNode: 'C3_S6A',
                effects: {
                    trust: 2,
                    security: 2,
                },
            },
        ],
    },

    // Scene 6A — She Chooses
    {
        id: 'C3_S6A',
        chapter: 3,
        scene: 6,
        text: `She chose me.

Even from a distance.
Through the screen.

"I choose you," she said.

We were officially "Us".`,
        options: [
            {
                id: 'A',
                label: 'Celebrate (virtually)',
                nextNode: 'C3_S7',
                effects: {
                    closeness: 2,
                },
            },
        ],
    },

    // Scene 7 — Unilag Visit
    {
        id: 'C3_S7',
        chapter: 3,
        scene: 7,
        text: `We didn't actually meet after asking her out till a week later.

I invited her to Unilag.

Finally physically together.
We had a bit of... promiscuous fun.

The teaser and the sensitive one.
Finally in sync.`,
        options: [
            {
                id: 'A',
                label: 'Enjoy the moment',
                nextNode: 'C3_END',
                effects: {
                    desire: 3,
                    closeness: 3,
                },
            },
        ],
    },

    // Chapter End
    {
        id: 'C3_END',
        chapter: 3,
        scene: 999,
        text: `We were high on new love.

But life has a way of testing things.

November was coming.`,
        options: [
            {
                id: 'A',
                label: 'Continue to Chapter 4',
                nextNode: 'C4_S1',
                effects: {},
            },
        ],
    },
];

// Chapter 4: "The Crack"
const chapter4Nodes: StoryNode[] = [
    // Scene 1 — Late November
    {
        id: 'C4_S1',
        chapter: 4,
        scene: 1,
        text: `Late November.

I was dealing with a lot.
Emotional dealings with (my ex).

It was heavy.
And I was weak.`,
        options: [
            {
                id: 'A',
                label: 'Feel the weight',
                nextNode: 'C4_S2',
                effects: {
                    security: -1,
                },
            },
        ],
    },

    // Scene 2 — The Mistake
    {
        id: 'C4_S2',
        chapter: 4,
        scene: 2,
        text: `In the heat of the moment...
I cheated.
With (my ex).

It wasn't planned. It just happened.
A mess of old emotions and new mistakes.`,
        options: [
            {
                id: 'A',
                label: 'Accept what happened',
                nextNode: 'C4_S3',
                effects: {
                    trust: -2,
                    security: -2,
                },
            },
        ],
    },

    // Scene 3 — The Aftermath
    {
        id: 'C4_S3',
        chapter: 4,
        scene: 3,
        text: `We decided not to talk to each other again.
Me and (my ex).
It was best if we went our separate ways.

But the damage to "Us" was done.
My babe took it hard.`,
        options: [
            {
                id: 'A',
                label: 'Wait for her decision',
                nextNode: 'C4_S4',
                effects: {
                    trust: -1,
                },
            },
        ],
    },

    // Scene 4 — Forgiveness
    {
        id: 'C4_S4',
        chapter: 4,
        scene: 4,
        text: `She was hurt. Shattered.

But... she stuck with me.
She forgave me.

Despite my flaws.
Despite the teaser/overthinker making a mess of things.
The sensitive/playful girl chose to stay.`,
        options: [
            {
                id: 'A',
                label: 'Promise to be better',
                nextNode: 'C4_S5',
                effects: {
                    trust: 2,
                    closeness: 2,
                },
            },
        ],
    },

    // Scene 5 — Rebuilding (Cooking/Visiting)
    {
        id: 'C4_S5',
        chapter: 4,
        scene: 5,
        text: `Since then, we've been rebuilding.

Occasional outings.
Her cooking at my place.
Me visiting her place.

Our dynamic returned.
Me teasing, her playing.
Stubborn love.`,
        options: [
            {
                id: 'A',
                label: 'Cherish it',
                nextNode: 'C4_END',
                effects: {
                    closeness: 3,
                },
            },
        ],
    },

    // Chapter End
    {
        id: 'C4_END',
        chapter: 4,
        scene: 999,
        text: `Love isn't perfect.
It's stubborn.

And we are still here.`,
        options: [
            {
                id: 'A',
                label: 'Continue to Chapter 5',
                nextNode: 'C5_S1',
                effects: {},
            },
        ],
    },
];

// Chapter 5: "The Choice Point"
const chapter5Nodes: StoryNode[] = [
    // Scene 1 — The Quiet Distance
    {
        id: 'C5_S1',
        chapter: 5,
        scene: 1,
        text: `Late night. WhatsApp chat. No replies. Last seen hours ago.

She's withdrawn.
You've noticed.

"She's acting normal… but she's not okay. I know this pattern."`,
        options: [
            {
                id: 'A',
                label: 'Send a check-in message',
                nextNode: 'C5_S2A',
                effects: {
                    trust: 2,
                    closeness: 1,
                },
            },
            {
                id: 'B',
                label: 'Wait (Give space)',
                nextNode: 'C5_S2B',
                effects: {
                    security: 1,
                },
            },
            {
                id: 'C',
                label: 'Distract yourself (Avoidance)',
                nextNode: 'C5_S2C',
                effects: {
                    trust: -1,
                    closeness: -1,
                },
            },
        ],
    },

    // Scene 2A — Response to Check-in
    {
        id: 'C5_S2A',
        chapter: 5,
        scene: 2,
        text: `You sent the message.

"Hey… I know you're quiet. I'm here. You don't have to hide."

Within minutes, she replied.

Her walls came down.`,
        options: [
            {
                id: 'A',
                label: 'Listen without fixing',
                nextNode: 'C5_S3',
                effects: {
                    trust: 2,
                },
            },
            {
                id: 'B',
                label: 'Try to solve it',
                nextNode: 'C5_S3',
                effects: {
                    closeness: 1,
                },
            },
        ],
    },

    // Scene 2B — Giving Space
    {
        id: 'C5_S2B',
        chapter: 5,
        scene: 2,
        text: `You gave her space.

Hours passed.

Then she called.

"Were you waiting for me to reach out?"

Voice soft. Not angry. Just… aware.`,
        options: [
            {
                id: 'A',
                label: 'Be honest',
                nextNode: 'C5_S3',
                effects: {
                    trust: 1,
                },
            },
            {
                id: 'B',
                label: 'Play it cool',
                nextNode: 'C5_S3',
                effects: {
                    security: 1,
                },
            },
        ],
    },

    // Scene 2C — Avoidance Consequence
    {
        id: 'C5_S2C',
        chapter: 5,
        scene: 2,
        text: `You scrolled. Coded. Played chess. Slept.

The next day…

A voice note.

"Sometimes I feel like I'm alone even when I'm not. You're there… but not there."

That hit you.`,
        options: [
            {
                id: 'A',
                label: 'Apologize deeply',
                nextNode: 'C5_S3',
                effects: {
                    trust: 1,
                },
            },
            {
                id: 'B',
                label: 'Get defensive',
                nextNode: 'C5_S3',
                effects: {
                    trust: -2,
                    security: -1,
                },
            },
        ],
    },

    // Scene 3 — The Confession Night (THE PIVOT)
    {
        id: 'C5_S3',
        chapter: 5,
        scene: 3,
        text: `Late night. Deep talk. No jokes. No memes. Real.

She opened up about feeling unwanted sometimes.
Wanting reassurance.
Wanting consistency.

You shared your fear of not being enough.
Financial pressure.
Overthinking.

Then she asked the question:

"Do you really see a future with me… or are we just surviving?"`,
        options: [
            {
                id: 'A',
                label: 'Full commitment: "Yes. I\'m choosing you."',
                nextNode: 'C5_S4',
                effects: {
                    trust: 3,
                    closeness: 3,
                },
            },
            {
                id: 'B',
                label: 'Uncertain hope: "I want to… but I\'m scared."',
                nextNode: 'C5_S4',
                effects: {
                    trust: 1,
                    closeness: 1,
                },
            },
            {
                id: 'C',
                label: 'Emotional retreat: "I don\'t know."',
                nextNode: 'C5_S4',
                effects: {
                    trust: -2,
                    closeness: -2,
                },
            },
            {
                id: 'D',
                label: 'Avoid answer (Change topic)',
                nextNode: 'C5_S4',
                effects: {
                    trust: -3,
                    security: -2,
                },
            },
        ],
    },

    // Scene 4 — The Test of Action
    {
        id: 'C5_S4',
        chapter: 5,
        scene: 4,
        text: `Few weeks later.

Her birthday.

Money is tight.
Stress is high.
Exams. Work. Pressure.

You have limited resources.

How do you show love?`,
        options: [
            {
                id: 'A',
                label: 'Thoughtful low-budget gesture',
                nextNode: 'C5_ROUTE',
                effects: {
                    trust: 2,
                    closeness: 2,
                },
            },
            {
                id: 'B',
                label: 'No gesture (Too busy)',
                nextNode: 'C5_ROUTE',
                effects: {
                    trust: -2,
                    closeness: -3,
                },
            },
            {
                id: 'C',
                label: 'Promise + delay',
                nextNode: 'C5_ROUTE',
                effects: {
                    trust: -1,
                },
            },
            {
                id: 'D',
                label: 'Overstretch finances',
                nextNode: 'C5_ROUTE',
                effects: {
                    closeness: 1,
                    security: -1,
                },
            },
        ],
    },

    // Routing node - determines which ending based on accumulated stats
    {
        id: 'C5_ROUTE',
        chapter: 5,
        scene: 5,
        text: `The months that followed would define everything.

Every choice.
Every word.
Every silence.

They all mattered.`,
        options: [
            {
                id: 'A',
                label: 'Continue...',
                nextNode: 'C5_END3', // Default trigger; backend logic overrides this
                effects: {},
            },
        ],
    },

    // ENDING 1 — "Soulmates in Progress" (Best Ending)
    {
        id: 'C5_END1',
        chapter: 5,
        scene: 999,
        text: `Evening walk. Her hand in yours.

She said:
"You've changed. You listen now. You show up."

You smiled:
"I learned. Because you matter."

She squeezed your hand tighter.

───────────────────

They didn't become perfect.
They became intentional.

───────────────────

💚 ENDING 1: "Soulmates in Progress"

Love Level: 100
Status: Growing Together

Thank you for playing. 💕`,
        options: [],
    },

    // ENDING 2 — "Quietly Strong" (Good Ending)
    {
        id: 'C5_END2',
        chapter: 5,
        scene: 999,
        text: `Late-night call. Studying together remotely.

She said:
"We're not flashy… but I feel safe."

You smiled.

───────────────────

Not every love is loud.
Some are steady.

───────────────────

💛 ENDING 2: "Quietly Strong"

Love Level: 80
Status: Stable Bond

Thank you for playing. 💕`,
        options: [],
    },

    // ENDING 3 — "Almost" (Bittersweet Ending)
    {
        id: 'C5_END3',
        chapter: 5,
        scene: 999,
        text: `Long goodbye chat.

She said:
"I love you… but I'm tired."

You typed.
Deleted.
Typed again.

"I understand."

───────────────────

They loved each other.
But timing won.

───────────────────

🌫 ENDING 3: "Almost"

Love Level: 55
Status: Missed Connection

Thank you for playing. 💕`,
        options: [],
    },

    // ENDING 4 — "Drift Apart" (Sad Ending)
    {
        id: 'C5_END4',
        chapter: 5,
        scene: 999,
        text: `Seen messages. No replies.

Last text from her:

"Take care of yourself."

You stared at the screen.

───────────────────

Silence became the loudest goodbye.

───────────────────

💔 ENDING 4: "Drift Apart"

Love Level: 30
Status: Lost Signal

Thank you for playing. 💕`,
        options: [],
    },

    // ENDING 5 — "Self-Growth Arc" (Hidden Ending)
    {
        id: 'C5_END5',
        chapter: 5,
        scene: 999,
        text: `You're coding alone. Studying. Journaling.

You read old chats.

Inner voice:
"I wasn't ready. But I'm learning."

───────────────────

Sometimes love teaches you…
before it stays.

───────────────────

🔁 ENDING 5: "Self-Growth Arc"

Love Level: 60
Status: Becoming Better

[New Game+ Unlocked]

Thank you for playing. 💕`,
        options: [],
    },
];

// Validation function
function validateStoryNodes(nodes: StoryNode[]): void {
    const nodeIds = new Set(nodes.map((node) => node.id));
    const errors: string[] = [];

    for (const node of nodes) {
        for (const option of node.options) {
            if (!nodeIds.has(option.nextNode)) {
                errors.push(
                    `❌ Node "${node.id}" option "${option.id}" points to non-existent node "${option.nextNode}"`,
                );
            }
        }
    }

    if (errors.length > 0) {
        console.error('🚨 Validation Errors:\n');
        errors.forEach((error) => console.error(error));
        throw new Error('Story node validation failed');
    }

    console.log('✅ All story nodes validated successfully');
    console.log(`📊 Total nodes: ${nodes.length}`);
    console.log(
        `📊 Total options: ${nodes.reduce((sum, node) => sum + node.options.length, 0)}`,
    );
}

async function main() {
    console.log('🌱 Seeding story nodes...\n');

    // Combine all chapters
    const allNodes = [
        ...chapter1Nodes,
        ...chapter2Nodes,
        ...chapter3Nodes,
        ...chapter4Nodes,
        ...chapter5Nodes,
    ];

    // Validate all nodes before seeding
    console.log('\n🔍 Validating all chapters together...');
    validateStoryNodes(allNodes);

    console.log('\n💾 Inserting nodes into database...\n');

    try {
        // @ts-ignore
        await prisma.storyChoice.deleteMany();
        // @ts-ignore
        await prisma.storyNode.deleteMany();
        console.log('🧹 Cleared existing story data');
    } catch (e) {
        console.warn('⚠️ Note: Could not clear existing data. Tables might not exist yet.');
    }

    // Insert nodes and choices
    for (const node of allNodes) {
        // @ts-ignore
        await prisma.storyNode.create({
            data: {
                id: node.id,
                chapter: node.chapter,
                scene: node.scene,
                text: node.text,
            },
        });

        for (const option of node.options) {
            // @ts-ignore
            await prisma.storyChoice.create({
                data: {
                    id: `${node.id}_${option.id}`, // Deterministic ID to prevent stale frontend references
                    nodeId: node.id,
                    optionId: option.id,
                    label: option.label,
                    nextNodeId: option.nextNode,
                    trustDelta: option.effects.trust || 0,
                    closenessDelta: option.effects.closeness || 0,
                    securityDelta: option.effects.security || 0,
                    desireDelta: option.effects.desire || 0,
                },
            });
        }
    }
    console.log(`✅ Successfully inserted ${allNodes.length} nodes to DB`);

    // For now, just log the data
    console.log('📦 Story nodes ready for insertion:');
    console.log('\n📖 Chapter 1:');
    chapter1Nodes.forEach((node) => {
        console.log(
            `   - ${node.id} (Chapter ${node.chapter}, Scene ${node.scene}) — ${node.options.length} options`,
        );
    });
    console.log('\n📖 Chapter 2:');
    chapter2Nodes.forEach((node) => {
        console.log(
            `   - ${node.id} (Chapter ${node.chapter}, Scene ${node.scene}) — ${node.options.length} options`,
        );
    });
    console.log('\n📖 Chapter 3:');
    chapter3Nodes.forEach((node) => {
        console.log(
            `   - ${node.id} (Chapter ${node.chapter}, Scene ${node.scene}) — ${node.options.length} options`,
        );
    });
    console.log('\n📖 Chapter 4:');
    chapter4Nodes.forEach((node) => {
        console.log(
            `   - ${node.id} (Chapter ${node.chapter}, Scene ${node.scene}) — ${node.options.length} options`,
        );
    });
    console.log('\n📖 Chapter 5 (with 5 endings):');
    chapter5Nodes.forEach((node) => {
        console.log(
            `   - ${node.id} (Chapter ${node.chapter}, Scene ${node.scene}) — ${node.options.length} options`,
        );
    });

    console.log('\n🎉 Seeding complete! Chapters 1-5 ready.');
    console.log(`📊 Total: ${allNodes.length} nodes`);
    console.log('💚 Endings: 5 unique outcomes based on player choices');
}

main()
    .catch((e) => {
        console.error('❌ Error seeding database:', e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
        await pool.end();
    });

// Export for use in other files
export { chapter1Nodes, chapter2Nodes, chapter3Nodes, chapter4Nodes, chapter5Nodes };
export type { StoryNode, StoryOption };
