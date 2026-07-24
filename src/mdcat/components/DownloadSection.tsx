import React from "react";
import PhoneMockup from "../../mdcat/components/Phonemockup";
import screenshot from "../../mdcat/assets/images/screenshot.png";
import googlePlayBadge from "../../mdcat/assets/images/google-play-badge.png"; // get the official asset from https://play.google.com/intl/en_us/badges/

const PLAY_STORE_URL =
  "https://play.google.com/store/apps/details?id=pk.zaheen.app";

export default function DownloadSection() {
  return (
    <section style={styles.section}>
      <div style={styles.textCol}>
        <h2 style={styles.heading}>Also Download Zaheen Mobile App</h2>
        <a
          href={PLAY_STORE_URL}
          target="_blank"
          rel="noopener noreferrer"
          style={styles.badgeLink}
        >
          <img
            src={googlePlayBadge}
            alt="Get it on Google Play"
            style={styles.badgeImg}
          />
        </a>
      </div>

      <div style={styles.phoneCol}>
        <PhoneMockup image={screenshot} width={230} tilt={0} heightRatio={2} />
      </div>
    </section>
  );
}

const styles: Record<string, React.CSSProperties> = {
  section: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: "3rem",
    flexWrap: "wrap",
    padding: "4rem 2rem",
    background: "#0d1224",
  },
  textCol: {
    display: "flex",
    flexDirection: "column",
    alignItems: "flex-start",
    gap: "1.5rem",
    maxWidth: 360,
  },
  heading: {
    color: "#ffffff",
    fontWeight: 800,
    fontSize: "2.25rem",
    lineHeight: 1.15,
    margin: 0,
  },
  badgeLink: {
    display: "inline-block",
  },
  badgeImg: {
    height: 56,
    width: "auto",
    display: "block",
  },
  phoneCol: {
    display: "flex",
    justifyContent: "center",
  },
};
