const configuredApiUrl = (import.meta.env.VITE_API_URL || "").trim().replace(/\/$/, "");
const defaultRemoteApiUrl = "https://mymento-backend.onrender.com";
const remoteApiUrl = configuredApiUrl || defaultRemoteApiUrl;
const isDev = import.meta.env.DEV;
const useDevProxy = isDev && !configuredApiUrl;

export const API_URL = useDevProxy ? "" : remoteApiUrl;
export const API_BASE_URL = useDevProxy ? "/api" : `${remoteApiUrl}/api`;
export const SOCKET_URL = useDevProxy ? window.location.origin : remoteApiUrl;
export const UPLOADS_BASE_URL = useDevProxy ? "" : remoteApiUrl;
