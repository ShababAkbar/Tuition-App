/**
 * Simple referral tracking utility
 * Captures influencer referral codes from URL parameters
 * 48-hour window: Fair to both influencer and platform
 */

const REFERRAL_KEY = 'apna_tuition_referral';
const REFERRAL_EXPIRY = 48 * 60 * 60 * 1000; // 48 hours in milliseconds

/**
 * Capture referral code from URL on page load
 * Example: apna-tuition.com?ref=Ali
 * Each click refreshes the 48-hour window
 */
export const captureReferralCode = () => {
  try {
    const urlParams = new URLSearchParams(window.location.search);
    const refCode = urlParams.get('ref');
    
    if (refCode) {
      const referralData = {
        code: refCode,
        timestamp: Date.now() // Refresh timestamp on every click
      };
      localStorage.setItem(REFERRAL_KEY, JSON.stringify(referralData));
      console.log('Referral code captured:', refCode);
    }
  } catch (error) {
    console.error('Error capturing referral code:', error);
  }
};

/**
 * Get active referral code (if within 48 hours)
 * Returns null for organic/direct traffic after 48 hours
 */
export const getReferralCode = (): string | null => {
  try {
    const stored = localStorage.getItem(REFERRAL_KEY);
    if (!stored) return null;

    const { code, timestamp } = JSON.parse(stored);
    
    // Check if expired (48 hours)
    const isExpired = (Date.now() - timestamp) > REFERRAL_EXPIRY;
    
    if (isExpired) {
      localStorage.removeItem(REFERRAL_KEY);
      console.log('Referral code expired (48 hours passed)');
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
