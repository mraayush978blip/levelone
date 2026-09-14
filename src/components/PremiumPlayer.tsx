'use client';

import { useRef, useState, useEffect, useCallback } from 'react';
import { supabase } from '@/lib/supabase';

interface PremiumPlayerProps {
    url: string;
    phaseId: string;
    studentId: string;
    initialProgress: number;
    onComplete?: () => void;
}

function extractYouTubeId(url: string): string | null {
    if (!url) return null;
    const match = url.match(
        /(?:youtu\.be\/|youtube\.com\/(?:watch\?(?:.*&)?v=|embed\/|v\/|shorts\/))([a-zA-Z0-9_-]{11})/
    );
    return match ? match[1] : null;
}

export default function PremiumPlayer({ url, phaseId, studentId, initialProgress, onComplete }: PremiumPlayerProps) {
    const videoRef = useRef<HTMLVideoElement>(null);
    const lastSavedTimeRef = useRef(initialProgress);
    const [isClient, setIsClient] = useState(false);

    useEffect(() => {
        setIsClient(true);

        const handleFullscreenChange = () => {
            const isFullscreen = !!(
                document.fullscreenElement ||
                (document as any).webkitFullscreenElement ||
                (document as any).mozFullScreenElement ||
                (document as any).msFullscreenElement
            );

            if (isFullscreen) {
                // When entering fullscreen on mobile, request landscape orientation
                try {
                    const orientation = window.screen?.orientation as any;
                    if (orientation && typeof orientation.lock === 'function') {
                        orientation.lock('landscape').catch(() => {
                            // Silently ignore if browser/OS restricts orientation lock
                        });
                    }
                } catch {
                    // Ignore unsupported errors
                }
            } else {
                // When exiting fullscreen, unlock orientation back to natural/portrait
                try {
                    const orientation = window.screen?.orientation as any;
                    if (orientation && typeof orientation.unlock === 'function') {
                        orientation.unlock();
                    }
                } catch {
                    // Ignore unsupported errors
                }
            }
        };

        document.addEventListener('fullscreenchange', handleFullscreenChange);
        document.addEventListener('webkitfullscreenchange', handleFullscreenChange);

        return () => {
            document.removeEventListener('fullscreenchange', handleFullscreenChange);
            document.removeEventListener('webkitfullscreenchange', handleFullscreenChange);
        };
    }, []);

    const saveProgress = useCallback(async (seconds: number) => {
        if (Math.abs(seconds - lastSavedTimeRef.current) < 10) return;
        lastSavedTimeRef.current = seconds;
        try {
            await supabase
                .from('student_phase_activity')
                .update({ video_watched_seconds: Math.floor(seconds) })
                .eq('phase_id', phaseId)
                .eq('student_id', studentId);
        } catch (err) {
            console.error('Failed to save video progress', err);
        }
    }, [phaseId, studentId]);

    const youtubeId = extractYouTubeId(url);

    const skeleton = (
        <div className="relative aspect-video rounded-xl overflow-hidden bg-black border border-slate-200 dark:border-slate-800 shadow-md flex items-center justify-center">
            <div className="w-10 h-10 border-4 border-blue-500 border-t-transparent rounded-full animate-spin" />
        </div>
    );

    if (!isClient) return skeleton;

    // YouTube: plain iframe — most reliable possible approach
    if (youtubeId) {
        const startParam = initialProgress > 5 ? `&start=${Math.floor(initialProgress)}` : '';
        const embedUrl = `https://www.youtube.com/embed/${youtubeId}?rel=0&modestbranding=1&enablejsapi=1&playsinline=1${startParam}`;

        return (
            <div className="relative aspect-video rounded-xl overflow-hidden bg-black border border-slate-200 dark:border-slate-800 shadow-md">
                {initialProgress > 5 && (
                    <div className="absolute top-3 left-3 z-20 bg-black/70 backdrop-blur-sm text-white px-3 py-1 rounded-lg text-xs font-bold pointer-events-none">
                        Resuming from {Math.floor(initialProgress / 60)}:{String(Math.floor(initialProgress % 60)).padStart(2, '0')}
                    </div>
                )}
                <iframe
                    src={embedUrl}
                    title="Video Player"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share; fullscreen"
                    allowFullScreen
                    className="absolute inset-0 w-full h-full border-0"
                    loading="lazy"
                />
            </div>
        );
    }

    // Non-YouTube: native HTML5 video
    return (
        <div className="relative aspect-video rounded-xl overflow-hidden bg-black border border-slate-200 dark:border-slate-800 shadow-md">
            {initialProgress > 5 && (
                <div className="absolute top-3 left-3 z-20 bg-black/70 backdrop-blur-sm text-white px-3 py-1 rounded-lg text-xs font-bold pointer-events-none">
                    Resuming from {Math.floor(initialProgress / 60)}:{String(Math.floor(initialProgress % 60)).padStart(2, '0')}
                </div>
            )}
            <video
                ref={videoRef}
                src={url}
                controls
                controlsList="nodownload"
                playsInline
                className="absolute inset-0 w-full h-full"
                onLoadedMetadata={() => {
                    const v = videoRef.current;
                    if (v && initialProgress > 5 && initialProgress < v.duration - 2) {
                        v.currentTime = initialProgress;
                    }
                }}
                onTimeUpdate={() => {
                    const v = videoRef.current;
                    if (v) saveProgress(v.currentTime);
                }}
                onEnded={() => {
                    const v = videoRef.current;
                    if (v) saveProgress(v.duration);
                    onComplete?.();
                }}
            />
        </div>
    );
}
