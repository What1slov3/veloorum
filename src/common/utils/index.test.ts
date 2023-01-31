import { normalizeInnerCoords } from './normalizeInnerCoords';
import generateRandomString from './generateRandomString';
import TimeFormatter from './TimeFormatter';
import getChannelFromURL from './getChannelFromURL';
import isUUID from './isUUID';

// ? getChannelFromURL
describe('util getChannelFromURL test', () => {
  test('url with both id [channelId, chatId]', () => {
    expect(
      getChannelFromURL(
        'https://test.com/channel/eafc0026-2be3-4f2f-bed3-a2946cf4958e/9f312e00-670e-4bb8-86e2-a03cd73fb4d7'
      )
    ).toMatchObject(['eafc0026-2be3-4f2f-bed3-a2946cf4958e', '9f312e00-670e-4bb8-86e2-a03cd73fb4d7']);
  });

  test('empty url', () => {
    expect(getChannelFromURL('https://test.com/channel')).toBeNull();
  });

  test('url with wrong uuid', () => {
    expect(
      getChannelFromURL('https://test.com/channel/eafc0026-2be3-4f2f-bed3-a2946cf4958e/9f12e00-670e-4b8-6e2-a03db4d7')
    ).toBeNull();
  });
});

// ? isUUD
describe('util isUUID test', () => {
  test('is right uuid', () => {
    expect(isUUID('eafc0026-2be3-4f2f-bed3-a2946cf4958e')).toBeTruthy();
  });

  test('is wrong uuid', () => {
    expect(isUUID('eafc0026-2be3-2f2f-bed3-a2946cf4958e')).toBeFalsy();
    expect(isUUID('eafc0026-2be3-4f2f-bed3a2946cf4958e')).toBeFalsy();
    expect(isUUID('eafc0026-2be3-4f2f-be-a2946f4958e')).toBeFalsy();
    expect(isUUID('eafc0026-2be3-4f2f-be-a294')).toBeFalsy();
    expect(isUUID('')).toBeFalsy();
  });
});

// ? normalizeInnerCoords
describe('util normalizeInnerCoords', () => {
  const rect = {
    x: 150,
    y: 50,
    width: 200,
    height: 100,
    top: 50,
    right: 586,
    bottom: 290,
    left: 146,
    toJSON: () => {},
  };

  test('right rects', () => {
    expect(normalizeInnerCoords({ x: 250, y: 150 }, rect, true, true)).toMatchObject({ x: 250, y: 150 });
  });

  test('overflow top', () => {
    expect(normalizeInnerCoords({ x: 250, y: -10 }, rect, true, true)).toMatchObject({ x: 250, y: 10 });
  });

  test('overflow left', () => {
    expect(normalizeInnerCoords({ x: -10, y: 150 }, rect, true, true)).toMatchObject({ x: 10, y: 150 });
  });

  test('overflow right', () => {
    expect(normalizeInnerCoords({ x: window.innerWidth + 100, y: 150 }, rect, true, true)).toMatchObject({
      x: window.innerWidth - rect.width - 10,
      y: 150,
    });
  });

  test('overflow bottom', () => {
    expect(normalizeInnerCoords({ x: 150, y: window.innerHeight + 110 }, rect, true, true)).toMatchObject({
      x: 150,
      y: window.innerHeight - rect.height - 10,
    });
  });

  test('overflow both bottom', () => {
    expect(
      normalizeInnerCoords({ x: window.innerWidth + 120, y: window.innerHeight + 510 }, rect, true, true)
    ).toMatchObject({
      x: window.innerWidth - rect.width - 10,
      y: window.innerHeight - rect.height - 10,
    });
  });

  test('overflow both top', () => {
    expect(normalizeInnerCoords({ x: -102, y: -124 }, rect, true, true)).toMatchObject({
      x: 10,
      y: 10,
    });
  });
});

// ? timeFormatter
describe('util timeFormatter', () => {
  const tf = new TimeFormatter(0);

  test('date separator', () => {
    expect(tf.getDateSeparator()).toBe('1 Января 1970');
  });
  test('full message time', () => {
    expect(tf.getFullMessageTime()).toBe('четверг, 1 Января 1970г., 03:00:00');
  });
  test('message time', () => {
    expect(tf.getMessageTime()).toBe('01 янв 1970');
  });
  test('message short time', () => {
    expect(tf.getMessageTimeShort()).toBe('03:00');
  });
});

// ? generateRandomString

describe('util generateRandomString', () => {
  test('random value of right length', () => {
    expect(generateRandomString(20)).toHaveLength(20);
  });
});
