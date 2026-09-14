'use client';

import React, { useState } from 'react';
import { Play, Check, Terminal, Layers, Cpu, Flame } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const codeSnippets = {
  challenge1: {
    title: 'Phase 1 • DOM Manipulation & State',
    tab: 'App.jsx',
    code: `// LevelOne Phase 1 Assessment: Ultra Pacing Engine
import { useState, useEffect } from 'react';

export default function DevChallenge() {
  const [power, setPower] = useState(100);
  const [streak, setStreak] = useState(14);
  const [isCompiling, setIsCompiling] = useState(false);

  const boostStreak = () => {
    setIsCompiling(true);
    setTimeout(() => {
      setStreak(s => s + 1);
      setPower(p => Math.min(p + 15, 100));
      setIsCompiling(false);
    }, 450);
  };

  return (
    <div className="status-hud">
      <div className="badge">STATUS: LEVEL ONE SHINOBI</div>
      <h3>Current Output: SUCCESS (Exit Code 0)</h3>
    </div>
  );
}`,
    output: {
      status: 'VERIFIED BY MENTORS',
      score: '98/100',
      testsPassed: '8/8 unit tests',
      metrics: 'Memory: 14.2MB • Latency: 1.4ms',
      console: `[LEVELONE RUNNER] Compiling AST...
✓ Syntax tree validated
✓ No memory leaks detected
✓ Timed constraint passed in 320ms
>> All Phase 1 checkpoints unlocked!`
    }
  },
  challenge2: {
    title: 'Phase 2 • Full Stack API & Database',
    tab: 'server.ts',
    code: `// LevelOne Phase 2: High Performance RPC
import { createClient } from '@supabase/supabase-js';

export async function verifyCohortSubmission(studentId: string) {
  const { data, error } = await supabase.rpc('evaluate_submission', {
    p_student_id: studentId,
    p_phase: 2,
    p_strict_mode: true
  });

  if (error) throw new Error("Revocation check triggered");
  return { status: "QUALIFIED_FOR_MENTORSHIP", data };
}`,
    output: {
      status: 'PHASE 2 DEPLOYED',
      score: '100/100',
      testsPassed: '14/14 integration tests',
      metrics: 'Connection: Pool Active • Edge CDN Cached',
      console: `[POSTGRES] Running evaluate_submission()
✓ Row level security verified
✓ 20-Day pacing rule passed
>> LevelOne Phase 2 certificate generated.`
    }
  }
};

export default function InteractiveIDEPreview() {
  const [activeSnippetKey, setActiveSnippetKey] = useState<'challenge1' | 'challenge2'>('challenge1');
  const [isRunning, setIsRunning] = useState(false);
  const [runProgress, setRunProgress] = useState(0);

  const snippet = codeSnippets[activeSnippetKey];

  const handleRunCode = () => {
    setIsRunning(true);
    setRunProgress(0);
    const interval = setInterval(() => {
      setRunProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setIsRunning(false);
          return 100;
        }
        return prev + 25;
      });
    }, 120);
  };

  return (
    <div className="w-full max-w-5xl mx-auto my-12 relative group">
      {/* Outer ambient holographic glow */}
      <div className="absolute -inset-1 bg-gradient-to-r from-blue-600/30 via-cyan-500/20 to-indigo-600/30 rounded-3xl blur-2xl opacity-60 group-hover:opacity-90 transition-opacity duration-700 pointer-events-none" />

      {/* Main Terminal Shell */}
      <div className="relative rounded-2xl border border-blue-500/30 bg-[#070913]/95 backdrop-blur-2xl shadow-2xl overflow-hidden">
        {/* Terminal Header */}
        <div className="flex flex-wrap items-center justify-between px-4 py-3 bg-[#0a0d1a] border-b border-zinc-800/80 gap-3">
          {/* Window dots & prompt title */}
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded-full bg-red-500/80 inline-block border border-red-400/40" />
              <span className="w-3 h-3 rounded-full bg-yellow-500/80 inline-block border border-yellow-400/40" />
              <span className="w-3 h-3 rounded-full bg-emerald-500/80 inline-block border border-emerald-400/40" />
            </div>
            <div className="h-4 w-[1px] bg-zinc-800 mx-1 hidden sm:block" />
            <div className="flex items-center gap-2 text-xs font-mono text-zinc-400">
              <Terminal className="w-3.5 h-3.5 text-blue-400" />
              <span className="text-zinc-200 font-semibold">levelone-sandbox</span>
              <span className="text-zinc-500 text-[11px] hidden sm:inline">v2.4 (Active Cohort Mode)</span>
            </div>
          </div>

          {/* Snippet Selection Tabs */}
          <div className="flex items-center gap-1 bg-[#05060b] p-1 rounded-xl border border-zinc-800/80">
            <button
              onClick={() => {
                setActiveSnippetKey('challenge1');
              }}
              className={`px-3 py-1 text-xs font-mono rounded-lg transition-all flex items-center gap-1.5 cursor-pointer ${
                activeSnippetKey === 'challenge1'
                  ? 'bg-blue-600 text-white shadow-sm font-bold'
                  : 'text-zinc-400 hover:text-white hover:bg-zinc-800/50'
              }`}
            >
              <Layers className="w-3 h-3" />
              Phase 1 (Frontend)
            </button>
            <button
              onClick={() => {
                setActiveSnippetKey('challenge2');
              }}
              className={`px-3 py-1 text-xs font-mono rounded-lg transition-all flex items-center gap-1.5 cursor-pointer ${
                activeSnippetKey === 'challenge2'
                  ? 'bg-blue-600 text-white shadow-sm font-bold'
                  : 'text-zinc-400 hover:text-white hover:bg-zinc-800/50'
              }`}
            >
              <Cpu className="w-3 h-3" />
              Phase 2 (Full Stack)
            </button>
          </div>

          {/* Run / Execute Button */}
          <div className="flex items-center gap-2">
            <button
              onClick={handleRunCode}
              disabled={isRunning}
              className="inline-flex items-center gap-2 px-4 py-1.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-black font-black text-xs font-mono tracking-wider shadow-[0_0_15px_rgba(16,185,129,0.3)] active:scale-95 transition-all cursor-pointer disabled:opacity-50"
            >
              <Play className="w-3 h-3 fill-black" />
              {isRunning ? `COMPILING ${runProgress}%` : 'RUN IN SANDBOX'}
            </button>
          </div>
        </div>

        {/* IDE Split View: Editor on Left, Live Output / Terminal on Right */}
        <div className="grid grid-cols-1 lg:grid-cols-12 divide-y lg:divide-y-0 lg:divide-x divide-zinc-800/80 min-h-[340px]">
          {/* Code Editor Body (7 cols) */}
          <div className="lg:col-span-7 p-4 md:p-6 font-mono text-xs md:text-sm bg-[#070913] overflow-x-auto relative">
            <div className="flex items-center justify-between text-[11px] text-zinc-500 mb-3 border-b border-zinc-800/50 pb-2">
              <span className="flex items-center gap-2 text-blue-400 font-semibold">
                <span className="w-1.5 h-1.5 rounded-full bg-blue-400 animate-pulse" />
                {snippet.tab}
              </span>
              <span>UTF-8 • Strict Linting</span>
            </div>

            <pre className="text-zinc-300 leading-relaxed font-mono whitespace-pre-wrap selection:bg-blue-600/40">
              {snippet.code.split('\n').map((line, i) => (
                <div key={i} className="table-row group/line hover:bg-white/[0.02]">
                  <span className="table-cell pr-4 text-right text-zinc-600 select-none text-[11px] w-8">
                    {i + 1}
                  </span>
                  <span className="table-cell text-zinc-300 font-mono">
                    {line.startsWith('//') ? (
                      <span className="text-zinc-500 italic">{line}</span>
                    ) : line.includes('import') || line.includes('export') || line.includes('function') || line.includes('const') ? (
                      <span>
                        <span className="text-sky-400 font-bold">
                          {line.split(' ')[0]}{' '}
                        </span>
                        {line.substring(line.indexOf(' ') + 1)}
                      </span>
                    ) : line.includes('return') ? (
                      <span>
                        <span className="text-amber-400 font-bold">return </span>
                        {line.replace('return ', '')}
                      </span>
                    ) : (
                      line
                    )}
                  </span>
                </div>
              ))}
            </pre>
          </div>

          {/* Real-time Compiler Console & Evaluation Metrics (5 cols) */}
          <div className="lg:col-span-5 p-5 bg-[#05060c] flex flex-col justify-between font-mono">
            <div>
              {/* Output HUD header */}
              <div className="flex items-center justify-between pb-3 mb-4 border-b border-zinc-800/80">
                <div className="flex items-center gap-2 text-xs font-bold text-zinc-300">
                  <Flame className="w-3.5 h-3.5 text-amber-400" />
                  <span>LIVE COMPILER HUD</span>
                </div>
                <span className="text-[10px] text-emerald-400 bg-emerald-950/60 border border-emerald-800/80 px-2 py-0.5 rounded-full font-bold">
                  ● REALTIME EVAL
                </span>
              </div>

              {/* Status Box */}
              <AnimatePresence mode="wait">
                {isRunning ? (
                  <motion.div
                    key="running"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="p-4 rounded-xl border border-blue-500/40 bg-blue-950/20 text-center space-y-3"
                  >
                    <div className="w-6 h-6 border-2 border-blue-400 border-t-transparent rounded-full animate-spin mx-auto" />
                    <p className="text-xs text-blue-300">Analyzing code against LevelOne test suites...</p>
                    <div className="w-full bg-zinc-800 rounded-full h-1.5 overflow-hidden">
                      <div
                        className="bg-blue-500 h-full transition-all duration-150"
                        style={{ width: `${runProgress}%` }}
                      />
                    </div>
                  </motion.div>
                ) : (
                  <motion.div
                    key="results"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="space-y-4"
                  >
                    {/* Score banner */}
                    <div className="flex items-center justify-between p-3 rounded-xl bg-emerald-950/30 border border-emerald-800/50">
                      <div>
                        <div className="text-[10px] text-zinc-400 uppercase tracking-widest font-bold">Evaluation Score</div>
                        <div className="text-lg font-black text-emerald-400">{snippet.output.score}</div>
                      </div>
                      <div className="text-right">
                        <div className="text-[10px] text-zinc-400 uppercase tracking-widest font-bold">Test Coverage</div>
                        <div className="text-xs font-bold text-zinc-200">{snippet.output.testsPassed}</div>
                      </div>
                    </div>

                    {/* Console logs */}
                    <div className="p-3 rounded-xl bg-black/60 border border-zinc-800 text-[11px] leading-relaxed text-zinc-300 space-y-1">
                      <div className="text-zinc-500 font-semibold mb-1">Terminal Stream:</div>
                      {snippet.output.console.split('\n').map((clog, idx) => (
                        <div
                          key={idx}
                          className={clog.startsWith('✓') ? 'text-emerald-400 font-semibold' : clog.startsWith('>>') ? 'text-cyan-300 font-bold' : 'text-zinc-400'}
                        >
                          {clog}
                        </div>
                      ))}
                    </div>

                    {/* Hardware / Pacing specs */}
                    <div className="text-[10px] text-zinc-500 flex items-center justify-between pt-1">
                      <span>{snippet.output.metrics}</span>
                      <span className="text-blue-400 font-bold">Anti-Cheat Active</span>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Bottom mini-banner */}
            <div className="mt-6 pt-3 border-t border-zinc-800/60 flex items-center justify-between text-[11px] text-zinc-400">
              <span className="flex items-center gap-1.5 text-zinc-300">
                <Check className="w-3.5 h-3.5 text-emerald-400" />
                Timed Challenges
              </span>
              <span className="text-xs font-bold text-white bg-blue-600/20 border border-blue-500/30 px-2.5 py-1 rounded-lg">
                Interactive Playground
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
