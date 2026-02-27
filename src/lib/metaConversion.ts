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
    // Get User Agent (browser will provide this)
    const userAgent = navigator.userAgent;

    // Get Facebook cookies if available (for better attribution)
    const fbp = getCookie("_fbp");
    const fbc = getCookie("_fbc");

    // Call the Supabase Edge Function
    const { data, error } = await supabase.functions.invoke("track-meta-conversion", {
      body: {
        email: params.email,
        phone: params.phone,
        clientIp: undefined,
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
