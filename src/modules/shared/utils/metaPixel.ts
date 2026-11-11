const META_PIXEL_ID = "1570212090604983";
 
// Initialize Meta Pixel if the base code hasn't initialized it already.
export const initializeMetaPixel = () => {
  if (typeof window === "undefined") return;
 
  if (typeof window.fbq === "function") {
    window.fbq("init", META_PIXEL_ID);
    return;
  }
 
  // The base Pixel script should normally be installed in index.html.
  console.warn(
    "Meta Pixel is not initialized. Check the Pixel code in index.html."
  );
};
 
// Track a standard Meta event, e.g. Lead, Subscribe, CompleteRegistration.
export const trackMetaEvent = (eventName: string, parameters: Record<string, unknown> = {}) => {
  if (typeof window === "undefined") return;
 
  if (typeof window.fbq !== "function") {
    console.warn("Meta Pixel is not loaded. Event not sent:", eventName);
    return;
  }
 
  window.fbq("track", eventName, parameters);
};
 
// Track a custom Meta event when a standard event isn't suitable.
export const trackMetaCustomEvent = (eventName: string, parameters: Record<string, unknown> = {}) => {
  if (typeof window === "undefined") return;
 
  if (typeof window.fbq !== "function") {
    console.warn("Meta Pixel is not loaded. Event not sent:", eventName);
    return;
  }
 
  window.fbq("trackCustom", eventName, parameters);
};
 
// Track a successfully sent PIN.
export const trackPinSent = () => {
  trackMetaEvent("Lead");
};
 
// Track a confirmed subscription.
export const trackSubscription = (amount: number) => {
  const parameters = {};
 
  if (typeof amount === "number" && Number.isFinite(amount)) {
    parameters.value = amount;
    parameters.currency = "PKR";
  }
 
  trackMetaEvent("Subscribe", parameters);
};