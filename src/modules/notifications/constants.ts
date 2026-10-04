/** Long-polling: seconds the server holds `receiveNotification` open when the queue is empty (5–60). */
export const RECEIVE_TIMEOUT = 20;

/** Pause after a failed poll before trying again. */
export const RETRY_DELAY = 3_000;

export const MESSAGE_WEBHOOKS: Record<string, 'incoming' | 'outgoing'> = {
  incomingMessageReceived: 'incoming',
  outgoingMessageReceived: 'outgoing',
  outgoingAPIMessageReceived: 'outgoing'
};

export const STATUS_WEBHOOK = 'outgoingMessageStatus';
