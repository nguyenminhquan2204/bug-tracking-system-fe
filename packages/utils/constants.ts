export const SEPARATION = '|';

export enum HttpStatus {
  OK = 200,
  BAD_REQUEST = 400,
  UNAUTHORIZED = 401,
  FORBIDDEN = 403,
  NOT_FOUND = 404,
  CONFLICT = 409,
  UNPROCESSABLE_PROJECT = 422,
  INTERNAL_SERVER_ERROR = 500,
  SERVICE_UNAVAILABLE = 503,
}

export enum SupportLanguage {
  EN = 'en',
  JA = 'ja',
}

export enum OrderDirection {
  ASC = 'ASC',
  DESC = 'DESC',
}

export enum OrderBy {
  ID = 'id',
  CREATED_AT = 'createdAt',
  UPDATED_AT = 'updatedAt',
}

export enum PageRouter {
  HOME = '/',
  ACCOUNTS = '/accounts',
  LOGIN = '/login',
  FORGOT_PASSWORD = '/forgot-password',
  CHECK_EMAIL = '/check-email',
  SET_PASSWORD = '/set-password',
  VERIFY_EXPIRE = '/verify-expired',
  ERROR_403 = '/403',
  HACKATHONS = '/hackathons',
}

export const DEFAULT_FIRST_PAGE = 1;
export const DEFAULT_LIMIT = 7;
export const DEFAULT_LIMIT_FOR_DROPDOWN = 1000;
export const DEFAULT_ORDER_BY = OrderBy.CREATED_AT;
export const DEFAULT_ORDER_DIRECTION = OrderDirection.DESC;
export const DEFAULT_GET_LIST_QUERY = {
  page: DEFAULT_FIRST_PAGE,
  limit: DEFAULT_LIMIT,
  orderBy: DEFAULT_ORDER_BY,
  orderDirection: DEFAULT_ORDER_DIRECTION,
};

export const DATE_FORMAT = 'YYYY-MM-DD';

export enum DATE_TIME_FORMAT {
  YYYY_MM_DD_HYPHEN = 'YYYY-MM-DD',
  HH_MM_SS_CONLON = 'HH:mm:ss',
  YYYY_MM_DD_HYPHEN_HH_MM_SS_COLON = 'YYYY-MM-DD HH:mm:ss',
  YYYY_MM_DD_HYPHEN_HH_MM_COLON = 'YYYY-MM-DD HH:mm',
}

export const Regex = {
  EMAIL: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
  PHONE: /^\d{1,15}$/,
  URL: /^(https?:\/\/)?(www\.)?[a-zA-Z0-9@:%._~#=-]{2,256}\.[a-z]{2,6}([-a-zA-Z0-9@:%_~#?&/=]*)(?!.*[<>])(?!.*script)(?!.*javascript:)/,
};

export const INPUT_TEXT_MAX_LENGTH = 255;
export const TEXTAREA_MAX_LENGTH = 2000;

export const INPUT_NUMBER_ALLOW_KEYS = [
  'Backspace',
  'Tab',
  'ArrowLeft',
  'ArrowRight',
  'Delete',
  'Home',
  'End',
];

export const INTEGER_ALLOW_CODES = Array.from({ length: 10 }, (_, i) =>
  (48 + i).toString(),
);

export const DECIMAL_ALLOW_CODES = [...INTEGER_ALLOW_CODES, '.'];

export const DOT_ALLOW_CODES = ['Period', 'NumpadDecimal', '.'];

export const INPUT_PHONE_MAX_LENGTH = 15;

export const MAX_INTEGER = 9999999999;

export const VERSION_ALLOW_CODES = [
  ...INTEGER_ALLOW_CODES,
  '.',
  'v',
  'V',
  'Backspace',
  'Tab',
  'ArrowLeft',
  'ArrowRight',
  'Delete',
];

export const AdminRole = 'Admin';

// export const DEFAULT_TIMEZONE = 'Asia/Tokyo';
export const DEFAULT_TIMEZONE = 'Asia/Ho_Chi_Minh';
