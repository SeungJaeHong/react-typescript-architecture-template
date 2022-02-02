let isStorageAvailable = typeof localStorage !== 'undefined';

let isServer = typeof window === 'undefined';

export const checkIsServer = () => isServer;

export const checkIsStorageAvailable = () => isStorageAvailable;
