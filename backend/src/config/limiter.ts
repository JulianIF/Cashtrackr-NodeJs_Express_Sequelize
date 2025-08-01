import rateLimit from "express-rate-limit";

export const rateLimiter = rateLimit
({
    windowMs: 60 * 1000,
    limit: 5,
    message: {"error" : "Request Limit Reached..."}
})