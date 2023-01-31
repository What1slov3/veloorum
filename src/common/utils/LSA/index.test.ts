import LSSDefault from './defaultStructure';
import { deepObjectStructRestore } from './index';

describe('deepObjectStructComparison test', () => {
  test('object is restored to ls default', () => {
    expect(deepObjectStructRestore(LSSDefault, {})).toMatchObject(LSSDefault);
  });
  
  test('object with partial data is restored to ls default', () => {
    expect(
      deepObjectStructRestore(LSSDefault, {
        settings: {
          messageGroupGap: 4,
        },
      })
    ).toMatchObject(LSSDefault);
  });
});
