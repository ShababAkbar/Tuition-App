# Meta Conversions API - Track Conversion Function

## Overview
This Supabase Edge Function tracks tutor registration conversions to Meta (Facebook) Conversions API.

**Event Tracked:** `CompleteRegistration`

## Setup

### 1. Environment Variables
Make sure `META_CAPI_TOKEN` is set in your Supabase project secrets:

```bash
supabase secrets set META_CAPI_TOKEN=your_token_here
```

### 2. Deploy the Function
```bash
supabase functions deploy track-meta-conversion
```

### 3. Test the Function
```bash
supabase functions invoke track-meta-conversion --body '{
  "email": "test@example.com",
  "phone": "03001234567"
}'
```

## Usage in Frontend

```typescript
import { trackMetaConversion } from "@/lib/metaConversion";

// After successful tutor registration
await trackMetaConversion({
  email: user.email,
  phone: user.phone,
  eventId: "unique-event-id" // Optional: prevents duplicate events
});
```

## Integration Points

### Tutor Registration
Add this to your tutor onboarding/registration success handler:

**File:** `src/pages/TutorOnboarding.tsx`

```typescript
// After successful registration
const { error } = await supabase.from("tutors").insert(tutorData);

if (!error) {
  // Track the conversion
  await trackMetaConversion({
    email: tutorData.email,
    phone: tutorData.phone,
  });
  
  // Navigate to success page
  navigate("/dashboard");
}
```

## Data Sent to Meta

### Required Fields
- `event_name`: "CompleteRegistration"
- `event_time`: Unix timestamp
- `event_source_url`: "https://apna-tuition.com"
- `action_source`: "website"

### User Data (Hashed with SHA-256)
- `em`: Email (hashed)
- `ph`: Phone (normalized to +92 format, then hashed)
- `client_ip_address`: User's IP
- `client_user_agent`: Browser user agent
- `fbp`: Facebook browser cookie (if available)
- `fbc`: Facebook click ID (if available)

## Security Features

✅ Email and phone are **SHA-256 hashed** before sending (Meta requirement)
✅ Phone numbers are **normalized** to international format (+92)
✅ CORS headers properly configured
✅ Token stored securely in Supabase secrets
✅ Error handling and logging

## Testing

### Test Event in Meta Events Manager
1. Go to Meta Events Manager
2. Select your Pixel (1697558885021279)
3. Click "Test Events"
4. Send a test registration
5. You should see the event appear within 20 seconds

### Verify Hash Implementation
Emails and phones should be:
1. Trimmed and lowercased
2. SHA-256 hashed
3. Sent as hex string

Example:
- Input: `Test@Example.com`
- Normalized: `test@example.com`
- Hashed: `973dfe463ec85785f5f95af5ba3906ee...`

## Troubleshooting

### Event not appearing in Meta?
- Check that `META_CAPI_TOKEN` is set correctly
- Verify Pixel ID is `1697558885021279`
- Check Supabase function logs: `supabase functions log track-meta-conversion`

### "Server configuration error"
- Token not set in Supabase secrets
- Run: `supabase secrets set META_CAPI_TOKEN=your_token`

### Phone number format issues
- Function auto-normalizes to Pakistan format (+92)
- Removes leading 0 from numbers like `03001234567`
- Result: `923001234567` (then hashed)

## Next Steps

### Add More Events
To track additional events (e.g., tuition applications, contact form):
1. Modify the function to accept `event_name` parameter
2. Add new event types: `Lead`, `Contact`, `ViewContent`
3. Update frontend helper to support multiple events

### Enable Advanced Matching
Add more user data fields for better attribution:
- `fn`: First name (hashed)
- `ln`: Last name (hashed)
- `ct`: City (hashed)
- `country`: Country code (e.g., "pk")
- `zp`: Postal code (hashed)

---

**Documentation Updated:** February 23, 2026
