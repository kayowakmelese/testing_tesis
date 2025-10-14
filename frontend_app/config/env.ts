const NODE_ENV = process.env.NODE_ENV

const NEXT_PUBLIC_WS_URL = process.env.NEXT_PUBLIC_WS_URL as string

if (!NEXT_PUBLIC_WS_URL) {
    console.error('NEXT_PUBLIC_WS_URL not provided as .env variable.')
    process.exit(1)
}

export const ENV = {
    NODE_ENV,
    NEXT_PUBLIC_WS_URL
}