-- Add referral tracking to tuition requests
-- Simple implementation for influencer commission tracking

ALTER TABLE tuition_requests 
ADD COLUMN referral_code TEXT;

-- Add index for faster filtering
CREATE INDEX idx_tuition_requests_referral ON tuition_requests(referral_code);

-- Comment for documentation
COMMENT ON COLUMN tuition_requests.referral_code IS 'Influencer referral code from URL parameter (e.g., Ali, Sara). NULL means organic/direct traffic.';
