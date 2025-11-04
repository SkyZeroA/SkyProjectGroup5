// Simple in-app pub/sub for activity updates
const listeners = new Set();

export function subscribeActivity(fn) {
  listeners.add(fn);
  return () => listeners.delete(fn);
}

export function publishActivity(event) {
  for (const fn of Array.from(listeners)) {
    try {
      fn(event);
    } catch (e) {
      // ignore listener errors
      // console.error('activityBus listener error', e);
    }
  }
}
