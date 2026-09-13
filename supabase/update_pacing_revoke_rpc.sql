-- ==============================================================================
-- UPDATE: Relative 20-Day Pacing & Revocation RPC
-- ==============================================================================
-- Replaces fixed calendar deadline checks with student-relative 20-day pacing.
-- 1. Phase 1 begins at student registration (users.created_at).
-- 2. Phase N begins when Phase N-1 has a valid submission.
-- 3. A student has 20 days per phase (or an admin extended deadline if larger).
-- 4. A student who signs up at ANY time (e.g. Sept 25) gets their full 20 days
--    and will NEVER be revoked due to past calendar dates.
-- ==============================================================================

CREATE OR REPLACE FUNCTION check_and_revoke_self()
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    current_student_id UUID;
    current_role       TEXT;
    current_status     TEXT;
    student_created_at TIMESTAMP;
    
    r_phase RECORD;
    prev_sub_time TIMESTAMP;
    phase_start_time TIMESTAMP;
    phase_deadline TIMESTAMP;
    ext_deadline TIMESTAMP;
    has_valid_sub BOOLEAN;
    
    is_overdue BOOLEAN := false;
    is_completed BOOLEAN;
BEGIN
    current_student_id := auth.uid();
    IF current_student_id IS NULL THEN 
        RETURN false; 
    END IF;

    -- Fetch user details
    SELECT role, status, created_at 
    INTO current_role, current_status, student_created_at
    FROM users 
    WHERE id = current_student_id;

    -- Admins can never be revoked
    IF current_role = 'admin' THEN
        IF current_status = 'revoked' THEN
            UPDATE users SET status = 'active', updated_at = NOW()
            WHERE id = current_student_id;
        END IF;
        RETURN false;
    END IF;

    -- Start anchor for Phase 1 is the student's registration date
    prev_sub_time := COALESCE(student_created_at, NOW());

    -- Iterate sequentially through active mandatory phases
    FOR r_phase IN (
        SELECT id, phase_number, title, is_paused
        FROM phases
        WHERE is_active = true
        ORDER BY phase_number ASC
    ) LOOP
        -- If phase is paused by admin, progression halts safely
        IF r_phase.is_paused THEN
            EXIT;
        END IF;

        -- Check if student completed this phase
        SELECT EXISTS (
            SELECT 1 FROM submissions
            WHERE student_id = current_student_id
              AND phase_id = r_phase.id
              AND status = 'valid'
        ) INTO has_valid_sub;

        -- Phase start time is registration for Phase 1, or completion time of previous phase
        phase_start_time := prev_sub_time;

        -- Calculate deadline: 20 days from start of this phase (end of day inclusive)
        phase_deadline := (phase_start_time + INTERVAL '20 days');

        -- Check for admin extension
        SELECT extended_deadline INTO ext_deadline
        FROM phase_extensions
        WHERE student_id = current_student_id
          AND phase_id = r_phase.id
        ORDER BY extended_deadline DESC
        LIMIT 1;

        IF ext_deadline IS NOT NULL AND ext_deadline > phase_deadline THEN
            phase_deadline := ext_deadline;
        END IF;

        IF has_valid_sub THEN
            -- Phase completed. Get the latest submission timestamp to anchor the next phase
            SELECT MAX(submitted_at) INTO prev_sub_time
            FROM submissions
            WHERE student_id = current_student_id
              AND phase_id = r_phase.id
              AND status = 'valid';

            IF prev_sub_time IS NULL THEN
                prev_sub_time := phase_start_time;
            END IF;
        ELSE
            -- This is the student's current active phase!
            -- Check if it has exceeded 20 days
            IF NOW() > phase_deadline THEN
                is_overdue := true;
            END IF;
            -- Current active phase reached; further phases are locked
            EXIT;
        END IF;
    END LOOP;

    -- Apply status updates
    IF is_overdue THEN
        IF current_status = 'active' THEN
            UPDATE users SET status = 'revoked', updated_at = NOW()
            WHERE id = current_student_id;

            INSERT INTO activity_logs (student_id, phase_id, activity_type, payload)
            VALUES (current_student_id, NULL, 'SELF_AUTO_REVOKE',
                    jsonb_build_object('reason', 'Active phase exceeded 20-day completion window'));
        END IF;
        RETURN true;
    ELSE
        -- If student was previously revoked but is no longer overdue (e.g. granted extension or submitted)
        IF current_status = 'revoked' THEN
            UPDATE users SET status = 'active', updated_at = NOW()
            WHERE id = current_student_id;

            INSERT INTO activity_logs (student_id, phase_id, activity_type, payload)
            VALUES (current_student_id, NULL, 'SELF_AUTO_RESTORE',
                    jsonb_build_object('reason', 'Active phase is within 20-day window or completed — access restored'));
        END IF;
        RETURN false;
    END IF;
END;
$$;
