import "server-only"

import axios from "axios"
import { cookies } from "next/headers"

const axiosClient = axios.create({
    baseURL: "http://localhost:3000/api/v1",
})

// 📌 Request interceptor
axiosClient.interceptors.request.use(
    async (config) => {
        const cookie = await cookies()
        const accessToken = cookie.get("accessToken")?.value

        if (accessToken) {
            config.headers.Authorization = `Bearer ${accessToken}`
        }

        // 🔍 Log outgoing request
        console.log("➡️ Outgoing Request:", {
            url: config.url,
            method: config.method,
            headers: config.headers,
            data: config.data,
        })

        return config
    },
    (error) => {
        console.error("❌ Request Error:", error)
        return Promise.reject(error)
    }
)

// 📌 Response interceptor
axiosClient.interceptors.response.use(
    (response) => {
        // 🔍 Log incoming response
        console.log("⬅️ Incoming Response:", {
            url: response.config.url,
            status: response.status,
            data: response.data,
        })
        return response
    },
    (error) => {
        if (error.response) {
            console.error("❌ Response Error:", {
                url: error.config?.url,
                status: error.response.status,
                data: error.response.data,
            })
        } else {
            console.error("❌ Network/Other Error:", error.message)
        }
        return Promise.reject(error)
    }
)

export { axiosClient }
export default axiosClient
