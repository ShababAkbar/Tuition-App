/**
 * Simple referral tracking utility
 * Captures influencer referral codes from URL parameters
 */

const REFERRAL_KEY = 'apna_tuition_referral';
const REFERRAL_EXPIRY = 30 * 24 * 60 * 60 * 1000; // 30 days in milliseconds

/**
 * Capture referral code from URL on page load
 * Example: apna-tuition.com?ref=Ali
 */
export const captureReferralCode = () => {
  try {
    const urlParams = new URLSearchParams(window.location.search);
    const refCode = urlParams.get('ref');
    
    if (refCode) {
      const referralData = {
        code: refCode,
        timestamp: Date.now()
      };
      localStorage.setItem(REFERRAL_KEY, JSON.stringify(referralData));
      console.log('Referral code captured:', refCode);
    }
  } catch (error) {
    console.error('Error capturing referral code:', error);
  }
};

/**
 * Get active referral code (if not expired)
 * Returns null for organic/direct traffic
 */
export const getReferralCode = (): string | null => {
  try {
    const stored = localStorage.getItem(REFERRAL_KEY);
    if (!stored) return null;

    const { code, timestamp } = JSON.parse(stored);
    
    // Check if expired (30 days)
    const isExpired = (Date.now() - timestamp) > REFERRAL_EXPIRY;
    
    if (isExpired) {
      localStorage.removeItem(REFERRAL_KEY);
      return null;
    }

    return code;
  } catch (error) {
    console.error('Error getting referral code:', error);
    return null;
  }
};

/**
 * Clear referral code (optional - for testing)
 */
export const clearReferralCode = () => {
  localStorage.removeItem(REFERRAL_KEY);
};
