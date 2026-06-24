/**
 * Mock chatbot API service for CrimeSphere AI.
 * Simulates network response delay for a more natural UX.
 */
export const sendMessage = async (message) => {
  // Simulate a 500ms API response delay
  await new Promise((resolve) => setTimeout(resolve, 500));
  
  return {
    success: true,
    response: "Found 3 repeat offenders in Bengaluru."
  };
};
