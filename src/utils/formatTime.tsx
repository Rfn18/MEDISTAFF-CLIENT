const formatTime = (time: string) => {
  const date = new Date(`1970-01-01T${time}`);
  return date.toLocaleTimeString("id-ID", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  });
};

export default formatTime;
