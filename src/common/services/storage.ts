import store from 'store2';

const createStorage = (type: 'local' | 'session') => ({
  get: (key: string) => store[type].get(key),
  set: (key: string, value: any) => store[type].set(key, value),
  remove: (key: string) => store[type].remove(key)
});

const storage = {
  local: createStorage('local'),
  session: createStorage('session')
};

export default storage;
