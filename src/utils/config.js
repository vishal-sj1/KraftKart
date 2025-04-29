export const BASE_URL =
  process.env.NODE_ENV === "production"
    ? "https://your-production-backend.com" // Replace with your production backend URL
    : "http://localhost:5000";