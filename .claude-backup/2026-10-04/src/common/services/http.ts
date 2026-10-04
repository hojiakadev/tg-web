import axios from 'axios';

const BASE_URL = (import.meta.env.VITE_API_BASE_URL ?? import.meta.env.VITE_BASE_API_URL) as string;

// QR code API
const QR_API_URL = import.meta.env.VITE_QR_API_URL;
const INSTANCE = import.meta.env.VITE_INSTANCE;

const pureRequest = axios.create({ baseURL: BASE_URL });

const request = axios.create({
  baseURL: BASE_URL
});

export const qrCodeRequest = axios.create({
  baseURL: `${QR_API_URL}/${INSTANCE}`
});

const greenApiRequest = axios.create({
  baseURL: `${BASE_URL}/${INSTANCE}`
});

const http = { pureRequest, request, qrCodeRequest, greenApiRequest };

export default http;
