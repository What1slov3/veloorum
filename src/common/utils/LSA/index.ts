import { TMessageContent } from './../../../store/chats/types';
import { TAppSettings, TLSStructure, TUnsentMessage, TUnsentMessages } from './types';

// LSA - Local Storage Access
// Для упрощенного доступа к ls и более эффективной работы с ним в рамках Astro

// Сверочный образец структуры ls
const LSStructure: TLSStructure = {
  unsentMessages: {},
  sendingErrorMessages: {},
  appSettings: {
    fontSize: 14,
    messageGroupGap: 4,
  },
};

const deepObjectStructComparison = (example: Record<string, any>, comparing: Record<string, any>) => {
  for (let key in example) {
    if (comparing.hasOwnProperty(key)) {
      if (typeof example[key] === 'object') {
        const isEqual = deepObjectStructComparison(example[key], comparing[key]);
        if (isEqual) {
          continue;
        } else {
          return false;
        }
      }
    } else {
      return false;
    }
  }
  return true;
};

const deepObjectStructRestore = (example: Record<string, any>, comparing: Record<string, any>) => {
  for (let key in example) {
    if (comparing.hasOwnProperty(key)) {
      if (typeof example[key] === 'object') {
        deepObjectStructComparison(example[key], comparing[key]);
      }
    } else {
      comparing[key] = example[key];
    }
  }
  return comparing;
};

// TODO разбить на модули

export class LSA {
  private _ls = localStorage;

  public init() {
    this.checkAndRestoreLSS();
  }

  private checkAndRestoreLSS() {
    for (let key in LSStructure) {
      //@ts-ignore
      if (!this._ls.getItem(key)) this._ls.setItem(key, JSON.stringify(LSStructure[key]));
      const lsField = JSON.parse(this._ls.getItem(key)!);
      const restored = deepObjectStructRestore(LSStructure[key as keyof typeof LSStructure], lsField);
      if (Object.keys(restored).length !== 0) this._ls.setItem(key, JSON.stringify(restored));
    }
  }

  public saveUnsentMessage(message: TUnsentMessage) {
    let unsentMessages: TUnsentMessages = JSON.parse(this._ls.getItem('unsentMessages')!);
    this._ls.setItem(
      'unsentMessages',
      JSON.stringify({
        ...unsentMessages,
        [message.context.chatId]: {
          ...unsentMessages[message.context.chatId],
          ...message.content,
        },
      })
    );
  }

  public getUnsentMessage(cid: string): TMessageContent | null {
    let unsentMessages: TUnsentMessages = JSON.parse(this._ls.getItem('unsentMessages')!);
    return unsentMessages[cid] || null;
  }

  public resetUnsentMessage(cid: string) {
    let unsentMessages: TUnsentMessages = JSON.parse(this._ls.getItem('unsentMessages')!);
    if (unsentMessages[cid]) delete unsentMessages[cid];
    this._ls.setItem('unsentMessages', JSON.stringify(unsentMessages));
  }

  public setAppSetting(field: string, value: string | number | null) {
    if (LSStructure.appSettings[field as keyof TAppSettings]) {
      const appSettings: TAppSettings = JSON.parse(this._ls.getItem('appSettings')!);
      this._ls.setItem('appSettings', JSON.stringify({ ...appSettings, [field]: value }));
    }
  }

  public getAppSettings(field: string): any {
    const appSettings: TAppSettings = JSON.parse(this._ls.getItem('appSettings')!);
    return appSettings[field as keyof TAppSettings];
  }
}
