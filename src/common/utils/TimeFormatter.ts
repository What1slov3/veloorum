const months = [
  'Января',
  'Февраля',
  'Марта',
  'Апреля',
  'Мая',
  'Июня',
  'Июля',
  'Августа',
  'Сентября',
  'Октября',
  'Ноября',
  'Декабря',
];

const shortcutMonths = ['янв', 'фев', 'мар', 'апр', 'мая', 'июн', 'июл', 'авг', 'сен', 'окт', 'ноя', 'дек'];

const days = ['воскресенье', 'понедельник', 'вторник', 'среда', 'четверг', 'пятница', 'суббота'];

class TimeFormatter {
  private _timestamp: number;
  private _timestampDate: Date;

  private _currentTimestamp: number = Date.now();
  private _currentDay = new Date(this._currentTimestamp).getDate();
  private _currentDayOfWeek = new Date(this._currentTimestamp).getDay();
  private _currentMonth = new Date(this._currentTimestamp).getMonth();
  private _currentYear = new Date(this._currentTimestamp).getFullYear();

  private _timestampDay: number;
  private _timestampDayOfWeek: number;
  private _timestampMonth: number;
  private _timestampYear: number;
  private _timestampHours: number;
  private _timestampMinutes: number;
  private _timestampSeconds: number;

  constructor(timestamp: number) {
    this._timestamp = timestamp;
    this._timestampDate = new Date(timestamp);

    this._timestampDay = this._timestampDate.getDate();
    this._timestampDayOfWeek = this._timestampDate.getDay();
    this._timestampMonth = this._timestampDate.getMonth();
    this._timestampYear = this._timestampDate.getFullYear();
    this._timestampHours = this._timestampDate.getHours();
    this._timestampMinutes = this._timestampDate.getMinutes();
    this._timestampSeconds = this._timestampDate.getSeconds();
  }

   /**
   * @returns Date with indicating today, yesterday etc with shortcut month name
   */
  public getMessageTime() {
    if (this._timestampDay === this._currentDay && this._timestampYear === this._currentYear) {
      return `Сегодня, ${addZero(this._timestampHours)}:${addZero(this._timestampMinutes)}`;
    }
    if (this._timestampDay === this._currentDay - 1 && this._timestampYear === this._currentYear) {
      return `Вчера, ${addZero(this._timestampHours)}:${addZero(this._timestampMinutes)}`;
    }
    if (this._timestampYear === this._currentYear) {
      return `${addZero(this._timestampDay)} ${shortcutMonths[this._timestampMonth]}`;
    }
    return `${addZero(this._timestampDay)} ${shortcutMonths[this._timestampMonth]} ${this._timestampYear}`;
  }

  /**
   * @returns Full date in format (ww, dd, mm, yy. hh:mm:ss)
   */
  public getFullMessageTime() {
    return `${days[this._timestampDayOfWeek]}, ${this._timestampDay} ${months[this._timestampMonth]} ${
      this._timestampYear
    }г., ${addZero(this._timestampHours)}:${addZero(this._timestampMinutes)}:${addZero(this._timestampSeconds)}`;
  }

  /**
   * @returns Date for message separator by date
   */
  public getDateSeparator() {
    if (this._timestampDay === this._currentDay) {
      return 'Сегодня';
    } else if (this._timestampDay === this._currentDay - 1) {
      return 'Вчера';
    } else if (this._timestampYear !== this._currentYear) {
      return `${this._timestampDay} ${months[this._timestampMonth]} ${this._timestampYear}`;
    } else {
      return `${this._timestampDay} ${months[this._timestampMonth]}`;
    }
  }

  /**
   * @returns Date in format (hh:mm)
   */
  public getMessageTimeShort() {
    return `${addZero(this._timestampHours)}:${addZero(this._timestampMinutes)}`;
  }
}

function addZero(date: number): string {
  if (date < 10) {
    return '0' + date;
  }
  return `${date}`;
}

export default TimeFormatter;
