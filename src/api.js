// api.js
import axios from "axios"
import { ACCESS_TOKEN, REFRESH_TOKEN } from "./constants.js"

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
})

// Intercepteur pour ajouter le token à chaque requête
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem(ACCESS_TOKEN)
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => Promise.reject(error)
)

// Intercepteur pour gérer le refresh token automatiquement
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config

    // si erreur 401 et qu’on n’a pas déjà essayé de refresh
    if (
      error.response &&
      error.response.status === 401 &&
      !originalRequest._retry
    ) {
      originalRequest._retry = true
      try {
        const refresh = localStorage.getItem(REFRESH_TOKEN)
        if (!refresh) {
          throw new Error("No refresh token available")
        }

        const res = await axios.post(
          `${import.meta.env.VITE_API_URL}/api/token/refresh/`,
          { refresh }
        )

        if (res.status === 200) {
          localStorage.setItem(ACCESS_TOKEN, res.data.access)
          // on rejoue la requête originale avec le nouveau token
          originalRequest.headers[
            "Authorization"
          ] = `Bearer ${res.data.access}`
          return api(originalRequest)
        }
      } catch (err) {
        console.error("Refresh token failed", err)
        localStorage.removeItem(ACCESS_TOKEN)
        localStorage.removeItem(REFRESH_TOKEN)
        window.location.href = "/login" // on force le logout
      }
    }
    return Promise.reject(error)
  }
)

export default api
