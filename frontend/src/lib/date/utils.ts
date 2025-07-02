/**
 * Represents the four seasons in Japan
 */
type JapaneseSeason = "spring" | "summer" | "autumn" | "winter";

/**
 * Gets the current season in Japan based on the system date
 * @returns The current Japanese season
 */
export const getCurrentSeasonInJapan = (): JapaneseSeason => {
  const now = new Date();
  const month = now.getMonth() + 1; // Months are 0-indexed in JS
  const day = now.getDate();

  // Traditional Japanese seasonal divisions:
  // Spring: March 1 - May 31
  // Summer: June 1 - August 31
  // Autumn: September 1 - November 30
  // Winter: December 1 - February 28/29

  if ((month === 3 && day >= 1) || month === 4 || month === 5) {
    return "spring";
  } else if ((month === 6 && day >= 1) || month === 7 || month === 8) {
    return "summer";
  } else if ((month === 9 && day >= 1) || month === 10 || month === 11) {
    return "autumn";
  } else {
    return "winter";
  }
};
