export const generateTestCases = async (
  requirement: string
) => {
  const response = await fetch(
    "http://127.0.0.1:8000/generate-testcases",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        requirement,
      }),
    }
  );

  return await response.json();
};