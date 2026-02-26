-- ============================================
-- FIX: Allow users to update their REJECTED applications
-- Date: 2026-02-26
-- Problem: Users cannot resubmit rejected profiles because RLS policy
--          only allows updates when status = 'pending'
-- Solution: Allow updates when status is 'pending' OR 'rejected'
-- ============================================

-- Drop the old restrictive policy
DROP POLICY IF EXISTS "Users can update own pending application" ON new_tutor;

-- Recreate with both pending AND rejected status allowed
CREATE POLICY "Users can update own pending or rejected application" 
ON new_tutor FOR UPDATE 
TO authenticated
USING (auth.uid() = user_id AND status IN ('pending', 'rejected'))
WITH CHECK (auth.uid() = user_id AND status IN ('pending', 'rejected'));
