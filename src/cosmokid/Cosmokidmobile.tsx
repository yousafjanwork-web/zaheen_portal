import React from "react";
import CosmokidApp from "./CosmokidApp";

// /cosmokid_mobile
// Renders the exact same CosmoKid experience as the main page,
// but with the logo hidden in the header. Everything else
// (nav links, controls, views, modals, chat assistant, etc.)
// is identical because it reuses the same underlying component.
export default function CosmoKidMobile() {
  return <CosmokidApp hideLogo />;
}