export const formatVideoDuration = (seconds) => {
  const sec = parseInt(seconds, 10);

  const h = Math.floor(sec / 3600);
  const m = Math.floor((sec % 3600) / 60);
  const s = sec % 60;

  const formatted =
    h > 0
      ? `${h}:${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`
      : `${m}:${s.toString().padStart(2, "0")}`;

  return formatted;
};
