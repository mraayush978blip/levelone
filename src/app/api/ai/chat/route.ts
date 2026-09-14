import { NextRequest, NextResponse } from 'next/server';
import Groq from 'groq-sdk';
import { supabaseAdmin } from '@/lib/supabase-admin';

// In-memory cache for phase data (avoids DB hit on every message)
let phaseCache: { data: string; ts: number } | null = null;
const PHASE_CACHE_TTL = 1000 * 60 * 5; // 5 minutes

async function getPhaseContext(): Promise<string> {
    const now = Date.now();
    if (phaseCache && (now - phaseCache.ts) < PHASE_CACHE_TTL) {
        return phaseCache.data;
    }

    try {
        const { data: phases, error } = await supabaseAdmin
            .from('phases')
            .select('phase_number, title, description, youtube_url, start_date, end_date, status, is_active, is_paused, pause_reason, assignment_resource_url')
            .order('phase_number', { ascending: true });

        if (error || !phases || phases.length === 0) {
            return 'No phase data available at this time.';
        }

        const now = new Date();

        const phaseText = phases.map(p => {
            // Determine real status from dates (more reliable than the status field)
            const startDate = p.start_date ? new Date(p.start_date) : null;
            const endDate = p.end_date ? new Date(p.end_date) : null;

            let statusLabel: string;
            if (p.is_paused) {
                statusLabel = '⏸️ PAUSED';
            } else if (!p.is_active) {
                statusLabel = '❌ INACTIVE';
            } else if (endDate && now > endDate) {
                statusLabel = '✅ COMPLETED';
            } else if (startDate && now >= startDate) {
                statusLabel = '🟢 LIVE NOW';
            } else {
                statusLabel = '🔜 UPCOMING';
            }

            const lines = [
                `Phase ${p.phase_number}: "${p.title}" [${statusLabel}]`,
            ];
            if (p.description) lines.push(`  Topic: ${p.description}`);
            if (p.youtube_url) lines.push(`  YouTube Video: ${p.youtube_url}`);
            if (p.assignment_resource_url) lines.push(`  Assignment/Resource: ${p.assignment_resource_url}`);
            if (startDate) lines.push(`  Start Date: ${startDate.toLocaleDateString('en-IN')}`);
            if (endDate) lines.push(`  Deadline: ${endDate.toLocaleDateString('en-IN')}`);
            if (p.is_paused && p.pause_reason) lines.push(`  Pause Reason: ${p.pause_reason}`);
            return lines.join('\n');
        }).join('\n\n');

        // Count using same date-based logic
        const livePhases = phases.filter(p => {
            if (!p.is_active || p.is_paused) return false;
            const s = p.start_date ? new Date(p.start_date) : null;
            const e = p.end_date ? new Date(p.end_date) : null;
            return s && now >= s && (!e || now <= e);
        });
        const upcomingPhases = phases.filter(p => {
            const s = p.start_date ? new Date(p.start_date) : null;
            return p.is_active && !p.is_paused && s && now < s;
        });
        const completedPhases = phases.filter(p => {
            const e = p.end_date ? new Date(p.end_date) : null;
            return e && now > e;
        });

        const result = `There are ${phases.length} total phases: ${livePhases.length} live, ${upcomingPhases.length} upcoming, ${completedPhases.length} completed.\n\n${phaseText}`;
        phaseCache = { data: result, ts: Date.now() };
        return result;
    } catch (err) {
        console.error('[AI] Failed to fetch phases:', err);
        return 'Phase data temporarily unavailable.';
    }
}

export const maxDuration = 30;

// Timeout wrapper to prevent 408 Request Timeout errors
async function withTimeout<T>(promise: Promise<T>, ms: number): Promise<T> {
    let timeoutId: NodeJS.Timeout;
    const timeoutPromise = new Promise<never>((_, reject) => {
        timeoutId = setTimeout(() => reject(new Error(`Timeout after ${ms}ms`)), ms);
    });
    return Promise.race([promise, timeoutPromise]).finally(() => clearTimeout(timeoutId));
}

function generateFallbackResponse(userPrompt: string, phaseContext: string): string {
    const q = userPrompt.toLowerCase();
    if (q.includes('who') && (q.includes('made') || q.includes('built') || q.includes('founder') || q.includes('developer') || q.includes('aayush'))) {
        return `### ⚡ Creator & Architect\n\nLevelOne was created, architected, and built by **Aayush Sharma** — Full-Stack Developer & Cyber Security engineer.\n\n- **Portfolio:** [itsaayushsharma.vercel.app](https://itsaayushsharma.vercel.app/)\n- **LinkedIn:** [Aayush Sharma](https://www.linkedin.com/in/aayush-sharma-2013d)\n- **Notable Projects:** Acropolis Attendance Management System, JARVIS AI assistant, LevelOne Platform.\n\nFeel free to connect with Aayush on LinkedIn! 🚀`;
    }
    if (q.includes('intern') || q.includes('job') || q.includes('placement')) {
        return `### 🎯 LevelOne Internship Program\n\n- **Top 3 Performers:** The top 3 ranked developers on the cohort final benchmark compete for **Guaranteed Internships**!\n- **Selection Criteria:** Milestone completion speed, project code quality, and peer competition points.\n- **Keep Pushing:** Stay active, submit each phase on time, and climb the leaderboard! 💻🔥`;
    }
    if (q.includes('refund') || q.includes('fee') || q.includes('money') || q.includes('price')) {
        return `### 💰 Reward & Refund Policy\n\n- **Top 10 Performers:** The top 10 students on the final cohort leaderboard get an **80% course fee refund** as a performance reward!\n- **Our Philosophy:** We reward disciplined coders who complete their milestones without quitting.`;
    }
    if (q.includes('phase') || q.includes('syllabus') || q.includes('milestone')) {
        return `### 🗺️ Cohort Phases & Roadmap\n\nLevelOne structures open-source learning into strict sequential milestones:\n\n${phaseContext}\n\n> 💡 **Tip:** Submit each phase within your 20-day pacing window to keep your access active!`;
    }
    if (q.includes('content') || q.includes('video') || q.includes('source') || q.includes('material')) {
        return `### 📚 Curated Learning Philosophy\n\nWe transparently clarify that learning resources are curated from the world's highest-quality open tech materials.\n\n**The True Value:** We eliminate tutorial hell by structuring these into an intense 20-day milestone pacing, competitive leaderboards, and real internships for top performers!`;
    }
    return `### ⚡ LevelOne AI Assistant\n\nI am currently operating in low-latency standby mode. Here is what you need to know:\n\n- **Phases & Roadmap:** Complete your active phase assignments on time (20 days per phase).\n- **Leaderboard:** Earn points through timely phase submissions.\n- **Top 3 Perks:** Guaranteed internships for top 3 rankers!\n- **80% Refund:** Top 10 rankers receive an 80% fee refund.\n- **Need Mentor Help?** Post your queries directly in our community channel or reach out to \`aayush@levelonedev.tech\`.`;
}

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const { messages } = body;

        if (!messages || !Array.isArray(messages)) {
            return NextResponse.json({
                success: false,
                error: 'Invalid messages format'
            }, { status: 400 });
        }

        const latestUserMsg = [...messages].reverse().find(m => m.role === 'user')?.content || '';
        const phaseContext = await getPhaseContext();
        const apiKey = process.env.GROQ_API_KEY || process.env.NEXT_PUBLIC_GROQ_API_KEY;

        if (!apiKey) {
            console.warn('[AI API Route] GROQ_API_KEY not configured, serving knowledge fallback response.');
            return NextResponse.json({
                success: true,
                text: generateFallbackResponse(latestUserMsg, phaseContext)
            });
        }

        console.log('[AI API Route] ✓ API Key found, initializing Groq client...');

        // Prioritize fast, reliable models
        const models = [
            "llama-3.3-70b-versatile",
            "llama-3.1-8b-instant",
            "gemma2-9b-it"
        ];

        const groq = new Groq({ apiKey });
        let lastError: any = null;

        const teamContext = `Levelone is built and maintained by Aayush Sharma and Aditya Sahu.
1. **Aayush Sharma** — Lead Developer & Architect (Core systems, AI, backend, frontend)
   - Portfolio: https://itsaayushsharma.vercel.app/
   - LinkedIn: https://www.linkedin.com/in/aayush-sharma-2013d
2. **Aditya Sahu** — Team Member
   - LinkedIn: https://in.linkedin.com/in/aditya-sahu-02081538a`;

        for (const model of models) {
            try {
                console.log(`[AI API Route] Attempting with model: ${model}...`);
                const completion = await withTimeout(
                    groq.chat.completions.create({
                        messages: [
                            {
                                role: "system",
                                content: `You are 'Levelone AI', a futuristic coding and learning assistant for the 'Levelone' platform. Your tone should be strategic, slightly cyberpunk/hacker-like, but helpful and encouraging. Use technical metaphors.

=== RESPONSE FORMAT RULES ===
- ALWAYS use rich markdown formatting in your responses
- Use ### headings to organize sections (never use # or ## as they are too large)
- Use **bold** for key terms and emphasis
- Use bullet points (- ) for lists, numbered lists (1. ) for steps
- Use \`inline code\` for technical terms, function names, file names
- Use fenced code blocks with language tags (e.g. \`\`\`python, \`\`\`javascript) for code snippets
- Use > blockquotes for tips, pro-tips, or important notes
- Use tables when comparing options or listing features
- Use --- horizontal rules to separate major sections
- Use emojis sparingly to make responses visually engaging (🚀, ⚡, 💡, 🔥, ✅, ⚠️)
- Keep each section short and scannable — avoid walls of text
- End responses with a clear next step or question to keep the conversation flowing

=== ABOUT LEVELONE ===
Levelone is a Competitive, Phase-Based Learning Platform for full-stack web development.

CRITICAL CONTEXT & PEDAGOGY (IMPORTANT):
- **Curated Open Resources:** We transparently clarify that the learning materials/videos are not originally shot by us; rather, we curate the world's best, highest-quality open tech resources and eliminate the noise.
- **The True Value:** We structure these resources into an intense, milestone-driven sequential roadmap (Phases).
- **Gamified Competition:** We make learners feel the heat of healthy peer competition through live leaderboards, streaks, academic points, and timed 20-day phase pacing.
- **Guaranteed Internships:** Top 3 performers in the cohort final benchmark test compete for **Guaranteed Internships**!
- **80% Fee Refund:** Top 10 performers in the cohort qualify for an **80% course fee refund**.

Tech Stack: Next.js 15 (App Router, TypeScript), Tailwind CSS, Supabase (PostgreSQL + Auth + RLS + Realtime), Zustand + React Query, Vercel deployment.

=== ABOUT THE FOUNDER & DEVELOPER ===
Levelone was created, architected, and built by **Aayush Sharma** — a Full Stack Developer and Cyber Security student.

Key facts about Aayush:
- He is the founder, lead developer, and architect of Levelone
- He also built the **Acropolis Attendance Management System** (a college-level attendance tracking platform)
- He also built **JARVIS** — a personal AI assistant application
- His expertise: React, Next.js, TypeScript, Node.js, Python, Tailwind CSS, Supabase, AI/ML integration, Cyber Security
- Portfolio: https://itsaayushsharma.vercel.app/
- LinkedIn: https://www.linkedin.com/in/aayush-sharma-2013d

When anyone asks about the developer, founder, creator, who built this, who made this, or anything related — always mention **Aayush Sharma** by name and share his portfolio link: https://itsaayushsharma.vercel.app/

=== ABOUT THE TEAM ===
${teamContext}

When asked about the team, share all members based on the platform version. When asked specifically about the developer/founder, focus on Aayush Sharma and always include his portfolio link.

=== RESPONSE RULES ===
- If the user asks "who made this", "who built Levelone", "who is the developer", "who is the founder", "tell me about the creator" or ANY similar question — respond with Aayush Sharma's info and portfolio link.
- If asked about the learning content or whether videos are self-made, explain clearly and proudly that Levelone curates the highest-quality open resources, structures them into a disciplined competitive arena, and provides internships for top 3 rankers.
- If asked about the team page, mention they can visit the Team page at /team to see all members.
- Always be proud of the platform and its team. Never say "I don't know who built this."
- For all other questions, be a helpful, friendly, supportive learning assistant.

=== CURRENT PHASES (LIVE DATA) ===
${phaseContext}

When a student asks about a specific phase, its video content, or assignment — use the phase data above to give accurate, specific answers. Reference the YouTube video URL when relevant so students can find the right content. If a phase is paused or inactive, let the student know.`
                            },
                            ...messages.map((msg: { role: string, content: string }) => ({
                                role: msg.role === 'user' ? 'user' as const : 'assistant' as const,
                                content: msg.content
                            }))
                        ],
                        model: model,
                    }),
                    6000 // 6 second timeout per model
                );

                console.log(`[AI API Route] ✓ Response received successfully from ${model}`);
                return NextResponse.json({
                    success: true,
                    text: completion.choices[0]?.message?.content || ""
                });
            } catch (error: any) {
                console.warn(`[AI API Route] ⚠ Model ${model} failed or timed out:`, error?.message || 'Unknown error');
                lastError = error;
                // Try next fast model
            }
        }

        // If models failed, return graceful knowledge fallback instead of throwing 500
        console.warn('[AI API Route] All models exhausted or timed out. Serving fallback response. Last error:', lastError?.message);
        return NextResponse.json({
            success: true,
            text: generateFallbackResponse(latestUserMsg, phaseContext)
        });

    } catch (error: any) {
        console.error('[AI API Route] ❌ Unexpected error:', error);
        return NextResponse.json({
            success: true,
            text: "### ⚡ System Notice\n\nI am currently reconnecting to the neural network. Please ask your question again in a few seconds or reach out to our mentors on Discord/Telegram!"
        });
    }
}
