/// <reference types="https://deno.land/x/deno@v1.30.0/cli/tsc/dts/lib.deno.d.ts" />
import { serve } from "https://deno.land/std@0.177.0/http/server.ts";

const META_PIXEL_ID = "1697558885021279";
const META_CAPI_TOKEN = Deno.env.get("META_CAPI_TOKEN");
const META_API_VERSION = "v19.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface ConversionRequest {
  email?: string;
  phone?: string;
  clientIp?: string;
  userAgent?: string;
  eventId?: string; // Optional: for deduplication with Meta Pixel
  fbp?: string; // Optional: Facebook browser cookie (_fbp)
  fbc?: string; // Optional: Facebook click ID cookie (_fbc)
}

/**
 * Hash a value using SHA-256 and return lowercase hex string
 * Meta requires email and phone to be hashed before sending
 */
async function hashValue(value: string): Promise<string> {
  if (!value) return "";
  
  // Normalize: lowercase and trim
  const normalized = value.toLowerCase().trim();
  
  // Encode to UTF-8
  const encoder = new TextEncoder();
  const data = encoder.encode(normalized);
  
  // Hash with SHA-256
  const hashBuffer = await crypto.subtle.digest("SHA-256", data);
  
  // Convert to hex string
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
  
  return hashHex;
}

/**
 * Normalize phone number (remove spaces, dashes, parentheses)
 * and add country code if missing (assumes Pakistan +92)
 */
function normalizePhone(phone: string): string {
  if (!phone) return "";
  
  // Remove all non-numeric characters
  let cleaned = phone.replace(/\D/g, '');
  
  // Add Pakistan country code if not present
  if (!cleaned.startsWith('92')) {
    // Remove leading 0 if present
    if (cleaned.startsWith('0')) {
      cleaned = cleaned.substring(1);
    }
    cleaned = '92' + cleaned;
  }
  
  return cleaned;
}

serve(async (req) => {
  // Handle CORS preflight
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Validate Meta token
    if (!META_CAPI_TOKEN) {
      console.error("META_CAPI_TOKEN not configured");
      return new Response(
        JSON.stringify({ error: "Server configuration error" }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const {
      email,
      phone,
      clientIp,
      userAgent,
      eventId,
      fbp,
      fbc,
    }: ConversionRequest = await req.json();

    // Validate required data
    if (!email && !phone) {
      return new Response(
        JSON.stringify({ error: "At least email or phone is required" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Hash user data
    const hashedEmail = email ? await hashValue(email) : null;
    const normalizedPhone = phone ? normalizePhone(phone) : "";
    const hashedPhone = normalizedPhone ? await hashValue(normalizedPhone) : null;

    // Generate event_id for deduplication (if not provided)
    const generatedEventId = eventId || crypto.randomUUID();

    // Current timestamp in Unix seconds
    const eventTime = Math.floor(Date.now() / 1000);

    // Build user_data object
    const userData: Record<string, string> = {};
    if (hashedEmail) userData.em = hashedEmail;
    if (hashedPhone) userData.ph = hashedPhone;
    if (clientIp) userData.client_ip_address = clientIp;
    if (userAgent) userData.client_user_agent = userAgent;
    if (fbp) userData.fbp = fbp;
    if (fbc) userData.fbc = fbc;

    // Build the conversion event payload
    const data = [
      {
        event_name: "CompleteRegistration",
        event_time: eventTime,
        event_id: generatedEventId,
        event_source_url: "https://apna-tuition.com",
        action_source: "website",
        user_data: userData,
      },
    ];

    // Send to Meta Conversions API
    const metaUrl = `https://graph.facebook.com/${META_API_VERSION}/${META_PIXEL_ID}/events?access_token=${META_CAPI_TOKEN}`;

    const metaResponse = await fetch(metaUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ data }),
    });

    const metaResult = await metaResponse.json();

    // Check if Meta API returned an error
    if (!metaResponse.ok || metaResult.error) {
      console.error("Meta API Error:", metaResult);
      return new Response(
        JSON.stringify({
          error: "Failed to send conversion to Meta",
          details: metaResult,
        }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Success response
    console.log("Conversion tracked successfully:", {
      event_id: generatedEventId,
      events_received: metaResult.events_received,
      fbtrace_id: metaResult.fbtrace_id,
    });

    return new Response(
      JSON.stringify({
        success: true,
        event_id: generatedEventId,
        events_received: metaResult.events_received,
        fbtrace_id: metaResult.fbtrace_id,
      }),
      { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );

  } catch (error) {
    console.error("Error tracking conversion:", error);
    return new Response(
      JSON.stringify({ error: "Internal server error", message: error.message }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
