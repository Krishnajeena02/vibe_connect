import axios from "axios"

export   const BASE_URL =process.env.NEXT_PUBLIC_BACKEND_URL
export const clientServer = axios.create({
    baseURL:BASE_URL
}) ;






