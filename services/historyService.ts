export const getHistory = async () => {
  const response = await fetch(
    "http://127.0.0.1:8000/history"
  );

  return await response.json();
};