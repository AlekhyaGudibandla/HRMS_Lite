import axios from "axios";

/**
 * Extracts a user-friendly error message from an Axios error or generic error.
 */
export const getErrorMessage = (error: unknown, fallback = "Something went wrong"): string => {
  if (axios.isAxiosError(error)) {
    // Server responded with a structured error
    if (error.response?.data?.message) {
      return error.response.data.message;
    }
    // Validation errors array
    if (error.response?.data?.errors) {
      return error.response.data.errors
        .map((e: { msg: string }) => e.msg)
        .join(", ");
    }
    // Network error
    if (error.code === "ERR_NETWORK") {
      return "Cannot connect to the server. Please check if the backend is running.";
    }
  }

  if (error instanceof Error) {
    return error.message;
  }

  return fallback;
};
