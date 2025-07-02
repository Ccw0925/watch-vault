export const toTitleCase = (str: string): string => {
  const smallWords =
    /^(a|an|and|as|at|but|by|en|for|if|in|of|on|or|the|to|v[.]?|via|vs[.]?)$/i;
  const alphanumericPattern = /([A-Za-z0-9\u00C0-\u00FF])/;

  return str
    .split(/\s+/)
    .map((word, index, array) => {
      // Skip empty words
      if (word.length === 0) return word;

      // Lowercase small words except when they start or end the title
      if (index > 0 && index < array.length - 1 && smallWords.test(word)) {
        return word.toLowerCase();
      }

      // Capitalize the first letter of each word
      return word.replace(alphanumericPattern, (match) => match.toUpperCase());
    })
    .join(" ");
};
