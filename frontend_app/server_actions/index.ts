import { AxiosError } from "axios"

export type ServerActionWrapperResponse<T> = { success: true, data: T } | {
    success: false,
    error: string
}


export const serverActionWrapper = async<T>(fn: () => Promise<T>): Promise<ServerActionWrapperResponse<T>> => {
    try {
        const data = await fn()
        return { data: data, success: true }
    } catch (error) {
        let errMsg = ""
        if (error instanceof AxiosError) {
            errMsg = error.message
        }

        if (error instanceof Error) {
            errMsg = error.message
        }

        return {
            error: errMsg,
            success: false
        }
    }
}