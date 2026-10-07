export async function register() {
  if (process.env.NEXT_RUNTIME === "nodejs") {
    // Validate server environment configurations on boot
    if (process.env.RESEND_API_KEY) {
      console.log("[Next.js Server Boot] Resend Cloud integration loaded successfully.");
    } else {
      console.warn("[Next.js Server Boot] Warning: RESEND_API_KEY not detected in runtime environment.");
    }
  }
}
