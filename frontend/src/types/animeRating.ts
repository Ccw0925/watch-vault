export type AgeRating = "g" | "pg" | "pg13" | "r17";

const ageRatingMap: Record<AgeRating, string> = {
  g: "G - All Ages",
  pg: "PG - Children",
  pg13: "PG-13 - Teens 13 or older",
  r17: "R - 17+ (violence & profanity)",
} as const;

export type AgeRatingValue = (typeof ageRatingMap)[AgeRating];

export const reverseAgeRatingMap: Record<AgeRatingValue, AgeRating> =
  Object.fromEntries(
    (Object.entries(ageRatingMap) as [AgeRating, AgeRatingValue][]).map(
      ([key, value]) => [value, key]
    )
  );
