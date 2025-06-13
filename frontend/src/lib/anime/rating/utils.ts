import {
  AgeRating,
  AgeRatingValue,
  reverseAgeRatingMap,
} from "@/types/animeRating";

export const getRatingKey = (value: AgeRatingValue): AgeRating => {
  return reverseAgeRatingMap[value];
};
