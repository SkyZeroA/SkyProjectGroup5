import { subscribeActivity, publishActivity } from '../lib/activityBus';

test('activityBus subscribe/publish/unsubscribe', () => {
  const listener = jest.fn();
  const unsubscribe = subscribeActivity(listener);
  publishActivity({ hello: 'world' });
  expect(listener).toHaveBeenCalledWith({ hello: 'world' });

  // Unsubscribe and ensure not called again
  unsubscribe();
  listener.mockClear();
  publishActivity({ x: 1 });
  expect(listener).not.toHaveBeenCalled();
});
