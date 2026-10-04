/**
 * Green-API rejects calls above a per-method frequency with HTTP 429 (e.g. getAvatar: 10 req/s).
 * The returned scheduler starts at most `perSecond` tasks in any one-second window and queues the rest.
 */
const rateLimit = (perSecond: number) => {
  const interval = 1000 / perSecond;
  let nextSlot = 0;

  return <T>(task: () => Promise<T>): Promise<T> => {
    const now = Date.now();
    const startAt = Math.max(now, nextSlot);
    nextSlot = startAt + interval;

    return new Promise<T>((resolve, reject) => {
      window.setTimeout(() => task().then(resolve, reject), startAt - now);
    });
  };
};

export default rateLimit;
