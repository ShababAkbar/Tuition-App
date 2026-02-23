import { supabase } from "./supabase";

interface TrackConversionParams {
  email?: string;
  phone?: string;
  eventId?: string; // Optional: for deduplication with Meta Pixel
}

/**
 * Track a conversion event to Meta Conversions API
 * Currently tracks: CompleteRegistration (Tutor Registration)
 */
export async function trackMetaConversion(params: TrackConversionParams) {
  try {
    // Get client IP and User Agent (browser will provide these)
    const clientIp = await getClientIp();
    const userAgent = navigator.userAgent;

    // Get Facebook cookies if available (for better attribution)
    const fbp = getCookie("_fbp");
    const fbc = getCookie("_fbc");

    // Call the Supabase Edge Function
    const { data, error } = await supabase.functions.invoke("track-meta-conversion", {
      body: {
        email: params.email,
        phone: params.phone,
        clientIp,
        userAgent,
        eventId: params.eventId,
        fbp,
        fbc,
      },
    });

    if (error) {
      console.error("Failed to track Meta conversion:", error);
      return { success: false, error };
    }

    console.log("Meta conversion tracked successfully:", data);
    return { success: true, data };
  } catch (error) {
    console.error("Error tracking Meta conversion:", error);
    return { success: false, error };
  }
}

/**
 * Get client IP address (best effort)
 * Note: This may not work in all environments due to browser privacy restrictions
 */
async function getClientIp(): Promise<string | undefined> {
  try {
    // Try to get IP from a public API (fallback option)
    const response = await fetch("https://api.ipify.org?format=json");
    const data = await response.json();
    return data.ip;
  } catch (error) {
    console.warn("Could not fetch client IP:", error);
    return undefined;
  }
}

/**
 * Get cookie value by name
 */
function getCookie(name: string): string | undefined {
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) {
    return parts.pop()?.split(";").shift();
  }
  return undefined;
}
