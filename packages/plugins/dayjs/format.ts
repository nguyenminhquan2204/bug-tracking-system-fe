import { PluginFunc } from 'dayjs';

declare module 'dayjs' {
  interface Dayjs {
    fmYYYYMMDD(separator?: string): string;
    fmYYYYMMDDHHmmss(separator?: string): string;
    fmYYYYMMDDHHmm(separator?: string): string;
    fmMMDDHHmm(separator?: string): string;
    fmHHmmss(separator?: string): string;
    fmHHmm(separator?: string): string;
    fmYYYYMMI18n(year?: string, month?: string): string;
    fmYYYYMMDDI18n(year?: string, month?: string, day?: string): string;
    fmYYYYMMDDHHmmI18n(
      year?: string,
      month?: string,
      day?: string,
      hour?: string,
      minute?: string,
    ): string;
    fmMMDDHHmmI18n(month?: string, day?: string, hour?: string, minute?: string): string;
    fmDDHHmmI18n(day?: string, hour?: string, minute?: string): string;
    fmHHmmI18n(hour?: string, minute?: string): string;
  }
}

export const displayPlugin: PluginFunc = (_, dayjsClass) => {
  dayjsClass.prototype.fmYYYYMMDD = function (separator = '/') {
    return this.format(`YYYY${separator}MM${separator}DD`);
  };
  dayjsClass.prototype.fmYYYYMMDDHHmmss = function (separator = '/') {
    return this.format(`YYYY${separator}MM${separator}DD HH:mm:ss`);
  };
  dayjsClass.prototype.fmYYYYMMDDHHmm = function (separator = '/') {
    return this.format(`YYYY${separator}MM${separator}DD HH:mm`);
  };
  dayjsClass.prototype.fmMMDDHHmm = function (separator = '/') {
    return this.format(`MM${separator}DD HH:mm`);
  };
  dayjsClass.prototype.fmHHmmss = function (separator = ':') {
    return this.format(`HH${separator}mm${separator}ss`);
  };
  dayjsClass.prototype.fmHHmm = function (separator = ':') {
    return this.format(`HH${separator}mm`);
  };
  dayjsClass.prototype.fmYYYYMMI18n = function (year = '年', month = '月度') {
    return this.format(`YYYY${year}MM${month}`);
  };

  dayjsClass.prototype.fmYYYYMMDDI18n = function (year = '年', month = '月', day = '日') {
    return this.format(`YYYY${year}MM${month}DD${day}`);
  };
  dayjsClass.prototype.fmYYYYMMDDHHmmI18n = function (
    year = '年',
    month = '月',
    day = '日',
    hour = '時',
    minute = '分',
  ) {
    return this.format(`YYYY${year}MM${month}DD${day}HH${hour}mm${minute}`);
  };

  dayjsClass.prototype.fmYYYYMMDDI18n = function (year = '年', month = '月', day = '日') {
    return this.format(`YYYY${year}MM${month}DD${day}`);
  };
  dayjsClass.prototype.fmMMDDHHmmI18n = function (
    month = '月',
    day = '日',
    hour = '時',
    minute = '分',
  ) {
    return this.format(`MM${month}DD${day}HH${hour}mm${minute}`);
  };
  dayjsClass.prototype.fmDDHHmmI18n = function (day = '日', hour = '時', minute = '分') {
    return this.format(`DD${day}HH${hour}mm${minute}`);
  };
  dayjsClass.prototype.fmHHmmI18n = function (hour = '時', minute = '分') {
    return this.format(`HH${hour}mm${minute}`);
  };
};
