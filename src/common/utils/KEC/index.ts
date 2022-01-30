// KEC - Keyboard Event Controller
// ? В приложении много глобальных ивентов
// ? Закрыть поп-ап на escape, начать писать при нажатии клавиши
// ? Вместо того, чтобы переопределять в каждом компоненте события,
// ? Был придуман простой способ делегировать события и даже вызывать их множество

type TEvent = 'onkeydown' | 'onkeyup' | 'onclick' | 'onmousedown' | 'onmouseup';

class KEC {
  private eventCache: Record<string, Record<string, Function>> = {
    onkeydown: {},
    onkeyup: {},
    onclick: {},
    onmousedown: {},
    onmouseup: {},
  };

  public init() {
    document.onkeydown = (e) => {
      for (let key in this.eventCache.onkeydown) {
        this.eventCache.onkeydown[key](e);
      }
    };
    document.onkeyup = (e) => {
      for (let key in this.eventCache.onkeyup) {
        this.eventCache.onkeyup[key](e);
      }
    };
    document.onclick = (e) => {
      for (let key in this.eventCache.onclick) {
        this.eventCache.onclick[key](e);
      }
    };
    document.onmousedown = (e) => {
      for (let key in this.eventCache.onmousedown) {
        this.eventCache.onmousedown[key](e);
      }
    };
    document.onmouseup = (e) => {
      for (let key in this.eventCache.onmouseup) {
        this.eventCache.onmouseup[key](e);
      }
    };
  }

  public add(event: TEvent, id: string, cb: Function) {
    this.eventCache[event][id] = cb;
  }

  public remove(event: TEvent, id: string) {
    delete this.eventCache[event][id];
  }

  public getEventCache() {
    return {...this.eventCache};
  }
}

export default KEC;
