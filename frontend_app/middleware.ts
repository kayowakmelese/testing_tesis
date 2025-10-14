import { NextRequest, NextResponse } from "next/server";
import { ENV } from "./config/env";
import axiosClient from "./lib/axios-client";
import { Tokens } from "./types";
import { COOKIE_NAMES, PATHS } from "./constants";

/**
 * Attempts to refresh the access token using the refresh token
 */
const refreshToken = async (refreshToken: string): Promise<{ success: true; data: Tokens } | { success: false }> => {
    try {
        const response = await axiosClient.post<Tokens>("/auth/refresh", { refreshToken });
        return { success: true, data: response.data };
    } catch (error) {
        console.error("RefreshTokenAction failed:", error);
        return { success: false };
    }
};

/**
 * Determines the appropriate redirect path based on environment
 */
const getRedirectPath = (isDevelopment: boolean): string => {
    return isDevelopment ? PATHS.DEV : PATHS.LOGIN;
};

const checkRouteInfo = (req: NextRequest) => {
    const pathname = req.nextUrl.pathname

    console.log({ pathname })

    let isProtected = false

    if (pathname.startsWith("/games")) {
        isProtected = true
    }


    return { isProtected }


}

/**
 * Creates a redirect response with cookies cleared if needed
 */
const createRedirectResponse = (req: NextRequest, shouldClearCookies: boolean = false): NextResponse => {
    const wasRight = ENV.NODE_ENV === "development"
    console.log({ wasRight })
    const redirectUrl = new URL(getRedirectPath(ENV.NODE_ENV === "development"), req.url);
    const response = NextResponse.redirect(redirectUrl);

    if (shouldClearCookies) {
        response.cookies.delete(COOKIE_NAMES.ACCESS_TOKEN);
        response.cookies.delete(COOKIE_NAMES.REFRESH_TOKEN);
    }

    return response;
};

/**
 * Middleware to handle authentication and token refresh
 */
export default async function authMiddleware(req: NextRequest): Promise<NextResponse> {
    const refreshTokenValue = req.cookies.get(COOKIE_NAMES.REFRESH_TOKEN)?.value;
    const accessTokenValue = req.cookies.get(COOKIE_NAMES.ACCESS_TOKEN)?.value;

    console.log({ accessTokenValue, refreshTokenValue })

    // If we have a refresh token, attempt to refresh the access token
    if (refreshTokenValue) {
        const result = await refreshToken(refreshTokenValue);

        if (!result.success) {
            return createRedirectResponse(req, true);
        }

        // Create a response and set the new tokens
        const response = NextResponse.next();
        response.cookies.set(COOKIE_NAMES.ACCESS_TOKEN, result.data.accessToken, {
            httpOnly: true,
            secure: ENV.NODE_ENV === "production",
            sameSite: "lax",
            path: "/",
        });
        response.cookies.set(COOKIE_NAMES.REFRESH_TOKEN, result.data.refreshToken, {
            httpOnly: true,
            secure: ENV.NODE_ENV === "production",
            sameSite: "lax",
            path: "/",
        });

        return response;
    }

    // If we have an access token but no refresh token, redirect to login
    if (accessTokenValue && !refreshTokenValue) {
        return createRedirectResponse(req, true);
    }

    const wasRight = ENV.NODE_ENV === "development"
    console.log({ wasRight })

    const { isProtected } = checkRouteInfo(req)

    if (isProtected) {
        return createRedirectResponse(req, true);
    }

    // If no tokens are present, continue to the requested page
    // (which might be a public page or might handle its own authentication)
    return NextResponse.next();
}

export const config = {
    matcher: ["/", "/dev", "/games/:path*"],
};