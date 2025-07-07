export const getGuestId = () => {
  if (typeof window === "undefined") {
    return;
  }

  const guestId = localStorage.getItem("guestId");

  if (guestId) return guestId;

  const newGuestId = crypto.randomUUID();
  localStorage.setItem("guestId", newGuestId);
  return newGuestId;
};
