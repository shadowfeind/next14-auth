/**
 * Array of routes that can be accessed publicly
 * @type{string[]}
 */
export const publicRoutes = [
    "/",
    '/auth/new-verification'
]

/**
 * Array of routes that used of authentication
 * @type{string[]}
 */
export const authRoutes = [
    "/auth/login",  
    "/auth/register",
    "/auth/error",
    "/auth/reset",
    "/auth/new-password"
]

/**
 * used for api authentication purpose
 * @type{string}
 */
export const authPrefix = "/api/auth"

/**
 * Route after login
 * @type{string}
 */
export const LOGIN_REDIRECT = "/settings"