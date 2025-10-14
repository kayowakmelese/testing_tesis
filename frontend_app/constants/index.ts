// Constants for cookie names to avoid hard-coded strings
export const COOKIE_NAMES = {
    ACCESS_TOKEN: "accessToken",
    REFRESH_TOKEN: "refreshToken",
} as const;

// Path constants
export const PATHS = {
    DEV: "/dev",
    LOGIN: "/auth/login",
    HOME: "/",
} as const;