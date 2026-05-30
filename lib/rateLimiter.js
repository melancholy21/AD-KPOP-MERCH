// Simple in-memory rate limiter for Next.js API Routes (Serverless Container Scope)
// Keep in mind: In a multi-instance serverless production environment, this is instance-scoped.
// For full distributed rate limiting, an external store like Redis (Upstash) is recommended.

const rateLimitMap = new Map();

/**
 * Rate limits requests based on IP address
 * @param {string} ip - Client IP address
 * @param {number} limit - Maximum requests allowed in the window
 * @param {number} windowMs - Time window in milliseconds
 * @returns {Promise<{ isLimited: boolean, limit: number, remaining: number }>}
 */
export async function rateLimit(ip, limit = 5, windowMs = 60000) {
    const now = Date.now();
    
    if (!rateLimitMap.has(ip)) {
        rateLimitMap.set(ip, []);
    }
    
    let timestamps = rateLimitMap.get(ip);
    
    // Filter timestamps to only include those in the current window
    timestamps = timestamps.filter(timestamp => now - timestamp < windowMs);
    
    if (timestamps.length >= limit) {
        rateLimitMap.set(ip, timestamps); // save filtered list
        return {
            isLimited: true,
            limit,
            remaining: 0
        };
    }
    
    timestamps.push(now);
    rateLimitMap.set(ip, timestamps);
    
    return {
        isLimited: false,
        limit,
        remaining: limit - timestamps.length
    };
}
