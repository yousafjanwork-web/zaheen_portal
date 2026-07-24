import React, { CSSProperties } from "react";

/**
 * PhoneMockup
 * A tilted iPhone frame with a screenshot as the screen and a soft shadow underneath.
 *
 * Usage:
 *   1. Drop your screenshot into your project, e.g. src/assets/zaheen-screenshot.png
 *   2. import screenshot from "./assets/zaheen-screenshot.png";
 *   3. <PhoneMockup image={screenshot} />
 */
export interface PhoneMockupProps {
  /** path/import of the screenshot to show on the screen */
  image?: string;
  /** rotation in degrees, default -7 */
  tilt?: number;
  /** frame width in px, default 220 */
  width?: number;
  /** how much of the image's top to crop off, as a %, default 12 */
  cropTop?: number;
  /** height = width * heightRatio, default 2.06 (iPhone-ish). Lower = shorter phone. */
  heightRatio?: number;
}

export default function PhoneMockup({
  image,
  tilt = -7,
  width = 220,
  cropTop = 12,
  heightRatio = 2.06,
}: PhoneMockupProps) {
  const height = Math.round(width * heightRatio);

  return (
    <div style={styles.wrapper}>
      <div
        style={{
          ...styles.shadow,
          width: width * 0.84,
          transform: `rotate(${tilt}deg)`,
        }}
      />

      <div
        style={{
          ...styles.frame,
          width,
          height,
          transform: `rotate(${tilt}deg)`,
        }}
      >
        <div style={styles.screen}>
          {image ? (
            <img
              src={image}
              alt="App screen preview"
              style={{
                ...styles.image,
                height: `${100 + cropTop}%`,
                marginTop: `-${cropTop}%`,
              }}
            />
          ) : (
            <div style={styles.placeholder}>Add an image prop</div>
          )}

          {/* notch */}
          <div style={styles.notch} />
        </div>
      </div>
    </div>
  );
}

const styles: Record<string, CSSProperties> = {
  wrapper: {
    position: "relative",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    padding: "60px 0",
  },
  shadow: {
    position: "absolute",
    bottom: 20,
    height: 28,
    borderRadius: "50%",
    background:
      "radial-gradient(ellipse at center, rgba(0,0,0,0.35) 0%, rgba(0,0,0,0) 70%)",
    filter: "blur(6px)",
    zIndex: 0,
  },
  frame: {
    position: "relative",
    background: "#111",
    borderRadius: 44,
    padding: 12,
    boxShadow:
      "0 30px 50px -12px rgba(0,0,0,0.45), 0 10px 20px -6px rgba(0,0,0,0.3)",
    zIndex: 1,
  },
  screen: {
    position: "relative",
    width: "100%",
    height: "100%",
    borderRadius: 34,
    overflow: "hidden",
    background: "#fff",
  },
  image: {
    width: "100%",
    height: "100%",
    objectFit: "cover",
    display: "block",
  },
  placeholder: {
    width: "100%",
    height: "100%",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    color: "#888",
    fontSize: 14,
    fontFamily: "sans-serif",
  },
  notch: {
    position: "absolute",
    top: 0,
    left: "50%",
    transform: "translateX(-50%)",
    width: "36%",
    height: 16,
    background: "#111",
    borderRadius: "0 0 16px 16px",
  },
};