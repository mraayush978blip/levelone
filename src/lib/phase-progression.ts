export interface StudentPhaseDeadline {
    phaseId: string;
    unlockDate: Date | null;
    deadline: Date | null;
    daysRemaining: number | null;
    isOverdue: boolean;
    deadlineFormatted: string;
}

export interface PhaseProgressionResult {
    unlockedPhaseIds: Set<string>;
    completedPhaseIds: Set<string>;
    lockedReasons: Record<string, string>;
    currentActivePhase: any | null;
    phaseDeadlines: Record<string, StudentPhaseDeadline>;
    activePhaseOverdue: boolean;
}

export const PHASE_DURATION_DAYS = 20;

/**
 * Calculates phase unlock status and student-relative deadlines.
 * Rules:
 * 1. Phase 1 unlocks on student registration (userCreatedAt).
 * 2. Each phase gives the student 20 days to complete.
 * 3. Phase N unlocks immediately when Phase N-1 is submitted, starting its own 20-day timer.
 * 4. Students who register at any time (e.g. Sept 25) receive their full 20 days and are never revoked due to earlier calendar dates.
 */
export function getStudentPhaseProgression(
    phases: any[],
    submissions: Set<string> | any[],
    extensions: Record<string, string> = {},
    userCreatedAt?: string | Date | null,
    submissionDates: Record<string, string | Date> = {}
): PhaseProgressionResult {
    const unlockedPhaseIds = new Set<string>();
    const completedPhaseIds = new Set<string>();
    const lockedReasons: Record<string, string> = {};
    const phaseDeadlines: Record<string, StudentPhaseDeadline> = {};

    // Normalize submissions set and map
    const subSet = submissions instanceof Set ? submissions : new Set(submissions.map((s: any) => s.phase_id || s));

    if (!phases || phases.length === 0) {
        return {
            unlockedPhaseIds,
            completedPhaseIds,
            lockedReasons,
            currentActivePhase: null,
            phaseDeadlines,
            activePhaseOverdue: false,
        };
    }

    // Sort phases by phase_number ascending
    const sortedPhases = [...phases].sort((a, b) => a.phase_number - b.phase_number);

    let canUnlockNext = true;
    let currentActivePhase: any | null = null;
    let activePhaseOverdue = false;

    // Student enrollment / start anchor
    const studentStartDate = userCreatedAt ? new Date(userCreatedAt) : new Date();
    let previousPhaseCompletedAt: Date = studentStartDate;

    const now = new Date();

    for (let i = 0; i < sortedPhases.length; i++) {
        const phase = sortedPhases[i];
        const isCompleted = subSet.has(phase.id);
        if (isCompleted) {
            completedPhaseIds.add(phase.id);
        }

        // Check if phase is paused by instructor
        if (phase.is_paused) {
            lockedReasons[phase.id] = 'This phase is temporarily paused by the instructor.';
            canUnlockNext = false;
            phaseDeadlines[phase.id] = {
                phaseId: phase.id,
                unlockDate: null,
                deadline: null,
                daysRemaining: null,
                isOverdue: false,
                deadlineFormatted: 'Paused'
            };
            continue;
        }

        // Phase is unlocked if Phase 1 or previous phase completed
        if (i === 0 || canUnlockNext) {
            unlockedPhaseIds.add(phase.id);

            // Calculate unlock date for this phase
            const unlockDate = i === 0 ? studentStartDate : previousPhaseCompletedAt;

            // Student deadline: 20 days from unlockDate, or admin extended deadline if later
            let deadline = new Date(unlockDate.getTime() + PHASE_DURATION_DAYS * 24 * 60 * 60 * 1000);
            deadline.setHours(23, 59, 59, 999);

            if (extensions[phase.id]) {
                const extDate = new Date(extensions[phase.id]);
                if (extDate > deadline) {
                    deadline = extDate;
                }
            }

            const diffMs = deadline.getTime() - now.getTime();
            const daysRemaining = Math.max(0, Math.ceil(diffMs / (1000 * 60 * 60 * 24)));
            const isOverdue = now > deadline;

            phaseDeadlines[phase.id] = {
                phaseId: phase.id,
                unlockDate,
                deadline,
                daysRemaining,
                isOverdue,
                deadlineFormatted: isCompleted 
                    ? 'Completed' 
                    : isOverdue 
                        ? 'Overdue' 
                        : `${daysRemaining} day${daysRemaining === 1 ? '' : 's'} left`
            };

            if (!isCompleted && !currentActivePhase) {
                currentActivePhase = phase;
                if (isOverdue) {
                    activePhaseOverdue = true;
                }
            }

            // Track completion date for sequential unlocking
            if (isCompleted) {
                if (submissionDates[phase.id]) {
                    previousPhaseCompletedAt = new Date(submissionDates[phase.id]);
                } else {
                    // Fallback to unlock date if exact submission timestamp wasn't provided
                    previousPhaseCompletedAt = new Date();
                }
            } else {
                canUnlockNext = false;
            }
        } else {
            const prevPhase = sortedPhases[i - 1];
            lockedReasons[phase.id] = `Complete Phase ${prevPhase.phase_number} (${prevPhase.title}) to unlock this scroll.`;
            phaseDeadlines[phase.id] = {
                phaseId: phase.id,
                unlockDate: null,
                deadline: null,
                daysRemaining: PHASE_DURATION_DAYS,
                isOverdue: false,
                deadlineFormatted: '20 days on unlock'
            };
        }
    }

    return {
        unlockedPhaseIds,
        completedPhaseIds,
        lockedReasons,
        currentActivePhase,
        phaseDeadlines,
        activePhaseOverdue,
    };
}
