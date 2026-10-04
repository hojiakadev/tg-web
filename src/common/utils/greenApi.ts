const API_URL = (import.meta.env.VITE_BASE_API_URL ?? '') as string;
const INSTANCE = (import.meta.env.VITE_INSTANCE ?? '') as string;
const TOKEN = (import.meta.env.VITE_QR_TOKEN ?? '') as string;

const INSTANCE_PATH = INSTANCE.startsWith('waInstance') ? INSTANCE : `waInstance${INSTANCE}`;

/** File uploads go to the media host: `https://4100.api.green-api.com` -> `https://4100.media.green-api.com`. */
const MEDIA_URL = ((import.meta.env.VITE_MEDIA_API_URL as string | undefined) ?? API_URL.replace('.api.', '.media.'))
  .replace(/\/$/, '');

/** Green-API method path, relative to the `http.request` base URL. */
const greenApi = (method: string) => `/${INSTANCE_PATH}/${method}/${TOKEN}`;

/** Absolute URL of a Green-API method served by the media host (file uploads). */
export const greenMediaApi = (method: string) => `${MEDIA_URL}${greenApi(method)}`;

export default greenApi;
