import { LSStructure as LSStructure } from '@customTypes/LSA.types';
import { LSSettings, LSUnsentMessage, LSUnsentMessages } from '@customTypes/LSA.types';
import { MessageContent } from '@customTypes/redux/chats.types';
import LSSDefault from './defaultStructure';

// LSA - Local Storage Access

export const deepObjectStructRestore = (reference: Record<string, any>, comparing: Record<string, any>) => {
  for (let key in reference) {
    if (comparing.hasOwnProperty(key)) {
      if (typeof reference[key] === 'object') {
        deepObjectStructRestore(reference[key], comparing[key]);
      }
    } else {
      comparing[key] = reference[key];
    }
  }
  return comparing;
};

// TODO разбить на модули

export class LSA {
  private _ls = localStorage;

  constructor() {
    this.checkAndRestoreLSS();
  }

  private checkAndRestoreLSS() {
    for (let key in LSSDefault) {
      if (!this._ls.getItem(key)) this._ls.setItem(key, JSON.stringify(LSSDefault[key as keyof LSStructure]));
      const lsField = JSON.parse(this._ls.getItem(key)!);
      const restored = deepObjectStructRestore(LSSDefault[key as keyof typeof LSSDefault], lsField);
      if (Object.keys(restored).length !== 0) this._ls.setItem(key, JSON.stringify(restored));
    }
  }

  public saveUnsentMessage(message: LSUnsentMessage) {
    let unsentMessages: LSUnsentMessages = JSON.parse(this._ls.getItem('unsentMessages')!);
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

  public getUnsentMessage(cid: string): MessageContent | null {
    let unsentMessages: LSUnsentMessages = JSON.parse(this._ls.getItem('unsentMessages')!);
    return unsentMessages[cid] || null;
  }

  public resetUnsentMessage(cid: string) {
    let unsentMessages: LSUnsentMessages = JSON.parse(this._ls.getItem('unsentMessages')!);
    if (unsentMessages[cid]) delete unsentMessages[cid];
    this._ls.setItem('unsentMessages', JSON.stringify(unsentMessages));
  }

  public setSetting(field: string, value: string | number | null) {
    if (LSSDefault.settings[field as keyof LSSettings]) {
      const appSettings: LSSettings = JSON.parse(this._ls.getItem('appSettings')!);
      this._ls.setItem('settings', JSON.stringify({ ...appSettings, [field]: value }));
    }
  }

  public getSettings(field: string): any {
    const settings: LSSettings = JSON.parse(this._ls.getItem('settings')!);
    return settings[field as keyof LSSettings];
  }
}
