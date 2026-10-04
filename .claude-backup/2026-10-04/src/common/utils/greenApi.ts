const INSTANCE = (import.meta.env.VITE_INSTANCE ?? '') as string;
const TOKEN = (import.meta.env.VITE_QR_TOKEN ?? '') as string;
const INSTANCE_PATH = INSTANCE.startsWith('waInstance') ? INSTANCE : `waInstance${INSTANCE}`;

/** Builds a Green-API method path relative to `http.request` base URL. */
const greenApi = (method: string) => `/${INSTANCE_PATH}/${method}/${TOKEN}`;

export default greenApi;
