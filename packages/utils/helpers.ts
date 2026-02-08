import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import timezone from 'dayjs/plugin/timezone';
import { DEFAULT_TIMEZONE } from './constants';

dayjs.extend(utc);
dayjs.extend(timezone);

// Edge Runtime compatible implementations (replacing lodash)
function isPlainObject(value: any): boolean {
  if (value === null || typeof value !== 'object') {
    return false;
  }
  const prototype = Object.getPrototypeOf(value);
  return prototype === null || prototype === Object.prototype;
}

function mapKeys<T extends Record<string, any>>(
  object: T,
  iteratee: (value: any, key: string) => void,
): void {
  for (const key in object) {
    if (Object.prototype.hasOwnProperty.call(object, key)) {
      iteratee(object[key], key);
    }
  }
}

function trim(str: string): string {
  return str.trim();
}

const getTimezone = () => {
  return Intl.DateTimeFormat().resolvedOptions().timeZone;
};

export function isJson(str: string): boolean {
  try {
    JSON.parse(str);
  } catch {
    return false;
  }
  return true;
}

export function checkEmptyObject(obj: any) {
  return Object.keys(obj).length === 0;
}

export function formatCurrencyNumber(num: number | string | undefined | null): string {
  if (!num) return '0';
  const number = Number(num);
  return Number.isInteger(number)
    ? number.toLocaleString()
    : number.toLocaleString('en-US', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      });
}

export function formatDate(date: string | Date, format = 'DD/MM/YYYY'): string {
  if (!date) return '';
  return dayjs(date).utc().tz(getTimezone()).format(format);
}

export function formatTime(date: string | Date, format = 'YYYY/MM/DD HH:mm:ss'): string {
  if (!date) return '';
  return dayjs(date).format(format);
}

export function downloadFileByLink(link: string, fileName: string) {
  const response = fetch(link);
  response.then((res) => {
    res.blob().then((blob) => {
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = fileName;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    });
  });
}

export function trimData(body: any): void {
  const trimValue = (item: any) => {
    mapKeys(item, (value, key) => {
      // trim string value
      if (typeof value === 'string') {
        item[key] = trim(value);
      }

      // iterate array
      else if (Array.isArray(value)) {
        value.forEach((subValue, index) => {
          // trim string value
          if (typeof subValue === 'string' && !trim(subValue as string)) {
            value[index] = trim(subValue);
          } else if (isPlainObject(subValue)) {
            trimValue(subValue);
          }
        });
      } else if (isPlainObject(value)) {
        trimValue(value);
      }
    });
  };

  trimValue(body);
}

export function capitalizeFirstLetter(str: string): string {
  if (!str) return '';
  return str.charAt(0).toUpperCase() + str.slice(1);
}

export function passwordStrengthCheck(value: string | undefined) {
  if (!value) return false;
  return (
    value.length >= 8 && /[a-z]/.test(value) && /[A-Z]/.test(value) && /[0-9]/.test(value)
  );
}

export const getFileNameFromHeader = (response: any) => {
  const contentDisposition = response.headers?.['content-disposition'];
  
  if (!contentDisposition) return 'result.html';

  const filenameRegex = /filename[^;=\n]*=((['"]).*?\2|[^;\n]*)/;
  const matches = filenameRegex.exec(contentDisposition);
  
  let fileName = 'result.html';

  if (matches != null && matches[1]) {
    fileName = matches[1].replace(/['"]/g, '');
    fileName = decodeURIComponent(fileName);
  }

  return fileName;
};