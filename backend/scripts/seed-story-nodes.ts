import 'dotenv/config';
import { PrismaClient } from '../src/generated/client';
import { PrismaPg } from '@prisma/adapter-pg';
import { Pool } from 'pg';

// Initialize Prisma with adapter (matching your PrismaService setup)
const connectionString = process.env.DATABASE_URL || '';
const pool = new Pool({ connectionString });
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

It was from her.

She got my number from Teni.

I smiled for longer than I should have.`,
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
                label: 'Overthink before replying',
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

Late nights.
Voice notes.
Laughing quietly in bed.

It felt easy.`,
        options: [
            {
                id: 'A',
                label: 'Open up emotionally',
                nextNode: 'C2_S3',
                effects: {
                    trust: 2,
                },
            },
            {
                id: 'B',
                label: 'Keep it playful',
                nextNode: 'C2_S3',
                effects: {
                    desire: 1,
                },
            },
        ],
    },

    // Scene 2B — Friendly Distance
    {
        id: 'C2_S2B',
        chapter: 2,
        scene: 2,
        text: `We chatted.

Mostly jokes.
Small updates.
Light conversations.

It was nice…
but safe.`,
        options: [
            {
                id: 'A',
                label: 'Deepen the convo',
                nextNode: 'C2_S3',
                effects: {
                    closeness: 1,
                },
            },
            {
                id: 'B',
                label: 'Maintain distance',
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
        text: `I typed.
Deleted.
Typed again.

"What if I sound desperate?"
"What if she ignores me?"

Minutes passed.

Finally, I replied.`,
        options: [
            {
                id: 'A',
                label: 'Be honest',
                nextNode: 'C2_S3',
                effects: {
                    trust: 1,
                },
            },
            {
                id: 'B',
                label: 'Hide feelings',
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
        text: `One night, she told me.

"I have a boyfriend."

My chest tightened.

But she kept talking to me.
Laughing.
Sharing.

I was confused.`,
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
                label: 'Stay emotionally close',
                nextNode: 'C2_S4B',
                effects: {
                    closeness: 2,
                },
            },
            {
                id: 'C',
                label: 'Pull back',
                nextNode: 'C2_S4C',
                effects: {
                    security: 1,
                },
            },
        ],
    },

    // Scene 4A — Healthy Boundaries
    {
        id: 'C2_S4A',
        chapter: 2,
        scene: 4,
        text: `I told myself:
"Do the right thing."

I stayed respectful.
Careful.
Patient.

She noticed.`,
        options: [
            {
                id: 'A',
                label: 'Stay consistent',
                nextNode: 'C2_S5',
                effects: {
                    trust: 1,
                },
            },
            {
                id: 'B',
                label: 'Confess feelings anyway',
                nextNode: 'C2_S5',
                effects: {
                    desire: 1,
                },
            },
        ],
    },

    // Scene 4B — Emotional Risk
    {
        id: 'C2_S4B',
        chapter: 2,
        scene: 4,
        text: `We got closer.

Deeper talks.
Personal stories.

Sometimes, it felt like…
more than friendship.`,
        options: [
            {
                id: 'A',
                label: 'Express feelings',
                nextNode: 'C2_S5',
                effects: {
                    desire: 2,
                },
            },
            {
                id: 'B',
                label: 'Hide them',
                nextNode: 'C2_S5',
                effects: {
                    security: -1,
                },
            },
        ],
    },

    // Scene 4C — Stepping Back
    {
        id: 'C2_S4C',
        chapter: 2,
        scene: 4,
        text: `I reduced replies.
Short messages.
Less calls.

It hurt.

But it felt safer.`,
        options: [
            {
                id: 'A',
                label: 'Reconnect later',
                nextNode: 'C2_S5',
                effects: {
                    closeness: 1,
                },
            },
            {
                id: 'B',
                label: 'Stay distant',
                nextNode: 'C2_S5',
                effects: {
                    closeness: -1,
                },
            },
        ],
    },

    // Scene 5 — The Letter
    {
        id: 'C2_S5',
        chapter: 2,
        scene: 5,
        text: `One day, everything poured out.

I wrote her a long message.
Page after page.

About my fears.
My confusion.
My feelings.

I was breaking down.`,
        options: [
            {
                id: 'A',
                label: 'Send it',
                nextNode: 'C2_S6',
                effects: {
                    trust: 2,
                },
            },
            {
                id: 'B',
                label: 'Rewrite and soften',
                nextNode: 'C2_S6',
                effects: {
                    trust: 1,
                },
            },
            {
                id: 'C',
                label: 'Delete it',
                nextNode: 'C2_S6',
                effects: {
                    security: -2,
                },
            },
        ],
    },

    // Scene 6 — Her Response
    {
        id: 'C2_S6',
        chapter: 2,
        scene: 6,
        text: `She read it.

Took some time.

Then replied:

"You don't have to worry.
I'm here for you."

I felt… safe.`,
        options: [
            {
                id: 'A',
                label: 'Thank her deeply',
                nextNode: 'C2_END',
                effects: {
                    closeness: 2,
                },
            },
            {
                id: 'B',
                label: 'Joke it off',
                nextNode: 'C2_END',
                effects: {
                    desire: 1,
                },
            },
            {
                id: 'C',
                label: 'Stay quiet',
                nextNode: 'C2_END',
                effects: {
                    security: -1,
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

She was becoming
my emotional home.

And that scared me.`,
        options: [],
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

Music. Food. Laughter.

We were celebrating her…

But somehow,
it felt like our day too.`,
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
                label: 'Hang with friends',
                nextNode: 'C3_S2B',
                effects: {
                    security: 1,
                },
            },
            {
                id: 'C',
                label: 'Watch her quietly',
                nextNode: 'C3_S2C',
                effects: {
                    desire: 1,
                },
            },
        ],
    },

    // Scene 2A — Shared Moments
    {
        id: 'C3_S2A',
        chapter: 3,
        scene: 2,
        text: `We walked side by side.

Shared snacks.
Shared jokes.

Sometimes,
our hands brushed.

I didn't pull away.`,
        options: [
            {
                id: 'A',
                label: 'Hold her hand',
                nextNode: 'C3_S3',
                effects: {
                    desire: 2,
                },
            },
            {
                id: 'B',
                label: 'Smile and tease',
                nextNode: 'C3_S3',
                effects: {
                    closeness: 1,
                },
            },
        ],
    },

    // Scene 2B — Group Energy
    {
        id: 'C3_S2B',
        chapter: 3,
        scene: 2,
        text: `I stayed with the group.

Laughing.
Playing.

Still,
I kept glancing at her.`,
        options: [
            {
                id: 'A',
                label: 'Rejoin her later',
                nextNode: 'C3_S3',
                effects: {
                    closeness: 1,
                },
            },
            {
                id: 'B',
                label: 'Keep distance',
                nextNode: 'C3_S3',
                effects: {
                    security: 1,
                },
            },
        ],
    },

    // Scene 2C — Quiet Watching
    {
        id: 'C3_S2C',
        chapter: 3,
        scene: 2,
        text: `I watched her from afar.

The way she laughed.
The way she moved.

My heart was loud.

My mouth was silent.`,
        options: [
            {
                id: 'A',
                label: 'Approach her',
                nextNode: 'C3_S3',
                effects: {
                    desire: 1,
                },
            },
            {
                id: 'B',
                label: 'Stay back',
                nextNode: 'C3_S3',
                effects: {
                    security: 1,
                },
            },
        ],
    },

    // Scene 3 — First Kiss
    {
        id: 'C3_S3',
        chapter: 3,
        scene: 3,
        text: `Later that day…

The drinks were light.
The mood was soft.

We stood close.

Our eyes met.

Then…

We kissed.

It was quiet.
Real.
Unplanned.`,
        options: [
            {
                id: 'A',
                label: 'Pull her closer',
                nextNode: 'C3_S4',
                effects: {
                    desire: 2,
                },
            },
            {
                id: 'B',
                label: 'Step back gently',
                nextNode: 'C3_S4',
                effects: {
                    trust: 1,
                },
            },
            {
                id: 'C',
                label: 'Apologize',
                nextNode: 'C3_S4',
                effects: {
                    security: 1,
                },
            },
        ],
    },

    // Scene 4 — Advice From Friends
    {
        id: 'C3_S4',
        chapter: 3,
        scene: 4,
        text: `After that day,
my friends spoke up.

Kcee. May. Akachi.
Layo. Anthony.

"Be clear with her."
"Don't be second option."
"Protect your heart."`,
        options: [
            {
                id: 'A',
                label: 'Take their advice',
                nextNode: 'C3_S5',
                effects: {
                    trust: 1,
                },
            },
            {
                id: 'B',
                label: 'Ignore it',
                nextNode: 'C3_S5',
                effects: {
                    desire: 1,
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

My chest was tight.

I told her:

"I can't do this halfway.
Please choose.
Me…
or him."`,
        options: [
            {
                id: 'A',
                label: 'Speak calmly',
                nextNode: 'C3_S6',
                effects: {
                    trust: 2,
                },
            },
            {
                id: 'B',
                label: 'Speak emotionally',
                nextNode: 'C3_S6',
                effects: {
                    closeness: 1,
                },
            },
            {
                id: 'C',
                label: 'Almost back out',
                nextNode: 'C3_S6',
                effects: {
                    security: -1,
                },
            },
        ],
    },

    // Scene 6 — Her Choice
    {
        id: 'C3_S6',
        chapter: 3,
        scene: 6,
        text: `She went quiet.

Thought deeply.

Then said:

"I choose you."

My heart stopped.

Then restarted.`,
        options: [
            {
                id: 'A',
                label: 'Hug her',
                nextNode: 'C3_END',
                effects: {
                    closeness: 2,
                },
            },
            {
                id: 'B',
                label: 'Thank her',
                nextNode: 'C3_END',
                effects: {
                    trust: 1,
                },
            },
            {
                id: 'C',
                label: 'Promise effort',
                nextNode: 'C3_END',
                effects: {
                    security: 1,
                },
            },
        ],
    },

    // Chapter End
    {
        id: 'C3_END',
        chapter: 3,
        scene: 999,
        text: `That day,
we became "us".

No more almost.

No more maybe.`,
        options: [],
    },
];

// Chapter 4: "The Crack"
const chapter4Nodes: StoryNode[] = [
    // Scene 1 — Old Feelings
    {
        id: 'C4_S1',
        chapter: 4,
        scene: 1,
        text: `November came fast.

Life got heavy.
School. Stress. Pressure.

Then…
Dayo texted.

Old memories woke up.`,
        options: [
            {
                id: 'A',
                label: 'Ignore it',
                nextNode: 'C4_S2A',
                effects: {
                    trust: 1,
                },
            },
            {
                id: 'B',
                label: 'Reply casually',
                nextNode: 'C4_S2B',
                effects: {
                    security: -1,
                },
            },
            {
                id: 'C',
                label: 'Get emotional',
                nextNode: 'C4_S2C',
                effects: {
                    closeness: -1,
                },
            },
        ],
    },

    // Scene 2A — Strong Boundaries
    {
        id: 'C4_S2A',
        chapter: 4,
        scene: 2,
        text: `I didn't reply.

I focused on her.

On us.

It wasn't easy.
But it was right.`,
        options: [
            {
                id: 'A',
                label: 'Tell my babe',
                nextNode: 'C4_S3',
                effects: {
                    trust: 2,
                },
            },
            {
                id: 'B',
                label: 'Keep it private',
                nextNode: 'C4_S3',
                effects: {
                    security: 1,
                },
            },
        ],
    },

    // Scene 2B — Slipping Back
    {
        id: 'C4_S2B',
        chapter: 4,
        scene: 2,
        text: `One reply became many.

Old jokes.
Old comfort.

I knew I was playing with fire.`,
        options: [
            {
                id: 'A',
                label: 'Cut it off',
                nextNode: 'C4_S3',
                effects: {
                    trust: 1,
                },
            },
            {
                id: 'B',
                label: 'Continue secretly',
                nextNode: 'C4_S3',
                effects: {
                    trust: -2,
                },
            },
        ],
    },

    // Scene 2C — Emotional Mess
    {
        id: 'C4_S2C',
        chapter: 4,
        scene: 2,
        text: `Talking to Dayo felt familiar.

Too familiar.

I was confused.

Lonely.

Weak.`,
        options: [
            {
                id: 'A',
                label: 'Confess confusion',
                nextNode: 'C4_S3',
                effects: {
                    trust: 1,
                },
            },
            {
                id: 'B',
                label: 'Hide it',
                nextNode: 'C4_S3',
                effects: {
                    security: -2,
                },
            },
        ],
    },

    // Scene 3 — The Mistake
    {
        id: 'C4_S3',
        chapter: 4,
        scene: 3,
        text: `One night,
everything crossed the line.

Emotions.
Proximity.
Poor decisions.

I cheated.`,
        options: [
            {
                id: 'A',
                label: 'Confess immediately',
                nextNode: 'C4_S4',
                effects: {
                    trust: 2,
                },
            },
            {
                id: 'B',
                label: 'Delay confession',
                nextNode: 'C4_S4',
                effects: {
                    trust: -1,
                },
            },
            {
                id: 'C',
                label: 'Hide it',
                nextNode: 'C4_S4',
                effects: {
                    trust: -3,
                },
            },
        ],
    },

    // Scene 4 — The Truth
    {
        id: 'C4_S4',
        chapter: 4,
        scene: 4,
        text: `She found out.

Or I told her.

Either way…

She was broken.`,
        options: [
            {
                id: 'A',
                label: 'Take full responsibility',
                nextNode: 'C4_S5',
                effects: {
                    security: 2,
                },
            },
            {
                id: 'B',
                label: 'Make excuses',
                nextNode: 'C4_S5',
                effects: {
                    trust: -2,
                },
            },
            {
                id: 'C',
                label: 'Beg',
                nextNode: 'C4_S5',
                effects: {
                    closeness: 1,
                },
            },
        ],
    },

    // Scene 5 — Forgiveness
    {
        id: 'C4_S5',
        chapter: 4,
        scene: 5,
        text: `Days passed.

Tears.
Silence.
Long talks.

Then she said:

"I'll try to forgive you."`,
        options: [
            {
                id: 'A',
                label: 'Promise change',
                nextNode: 'C4_S6',
                effects: {
                    trust: 2,
                },
            },
            {
                id: 'B',
                label: 'Show effort',
                nextNode: 'C4_S6',
                effects: {
                    security: 2,
                },
            },
            {
                id: 'C',
                label: 'Stay quiet',
                nextNode: 'C4_S6',
                effects: {
                    security: -1,
                },
            },
        ],
    },

    // Scene 6 — Repair
    {
        id: 'C4_S6',
        chapter: 4,
        scene: 6,
        text: `We rebuilt slowly.

More honesty.
More patience.

Less pride.

More "us".`,
        options: [
            {
                id: 'A',
                label: 'Be consistent',
                nextNode: 'C4_END',
                effects: {
                    closeness: 2,
                },
            },
            {
                id: 'B',
                label: 'Seek counseling/help',
                nextNode: 'C4_END',
                effects: {
                    trust: 1,
                },
            },
            {
                id: 'C',
                label: 'Avoid topic',
                nextNode: 'C4_END',
                effects: {
                    security: -1,
                },
            },
        ],
    },

    // Chapter End
    {
        id: 'C4_END',
        chapter: 4,
        scene: 999,
        text: `Love didn't end there.

It was wounded.

But still breathing.`,
        options: [],
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
    console.log('🔍 Validating Chapter 1...');
    validateStoryNodes(chapter1Nodes);

    console.log('\n🔍 Validating Chapter 2...');
    validateStoryNodes(chapter2Nodes);

    console.log('\n🔍 Validating Chapter 3...');
    validateStoryNodes(chapter3Nodes);

    console.log('\n🔍 Validating Chapter 4...');
    validateStoryNodes(chapter4Nodes);

    console.log('\n🔍 Validating Chapter 5...');
    validateStoryNodes(chapter5Nodes);

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
