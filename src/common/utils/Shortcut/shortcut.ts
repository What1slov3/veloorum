import exceptionKeys from './exceptionKeys';

export class Shortcut {
  public pressed: string[] = [];

  constructor() {
    document.addEventListener('keydown', (e: KeyboardEvent) => {
      this.press(e.code);
    });
    document.addEventListener('keyup', (e: KeyboardEvent) => {
      this.unpress(e.code);
    });
  }

  press(key: string) {
    if (!this.pressed.includes(key)) this.pressed.push(key);
  }

  unpress(key: string) {
    this.pressed = this.pressed.filter((pressedKey) => pressedKey !== key);
  }

  includes(key: string | string[]) {
    if (typeof key === 'string') {
      if (['Control', 'Shift', 'Alt'].includes(key)) {
        return this.pressed.includes(`${key}Left`) || this.pressed.includes(`${key}Right`);
      }
      return this.pressed.includes(key);
    }
    if (Array.isArray(key)) {
      return this.pressed.filter((pressedKey) => key.includes(pressedKey)).length === key.length;
    }
  }

  isException(key: string) {
    return exceptionKeys.includes(key);
  }
}
