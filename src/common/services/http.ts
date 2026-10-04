import axios from 'axios';

const BASE_URL = (import.meta.env.VITE_API_BASE_URL ?? import.meta.env.VITE_BASE_API_URL) as string;

// QR code API
const QR_API_URL = import.meta.env.VITE_QR_API_URL;
const INSTANCE = import.meta.env.VITE_INSTANCE;

/** Green-API client — paths are built with `greenApi(method)` from `@/common/utils`. */
const request = axios.create({
  baseURL: BASE_URL
});

export const qrCodeRequest = axios.create({
  baseURL: `${QR_API_URL}/${INSTANCE}`
});

const http = { request, qrCodeRequest };

export default http;
