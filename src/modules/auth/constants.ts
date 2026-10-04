export const QR_REFRESH_INTERVAL = 5_000;

/** Login screen polls the instance state to react to a scanned QR code. */
export const STATE_REFRESH_INTERVAL = 3_000;

export const QUERY_KEYS = {
  qr: ['auth', 'qr'] as const,
  state: ['auth', 'state'] as const
};

export const COUNTRIES = [
  { value: '+998', label: 'Uzbekistan' },
  { value: 'ru:+7', label: 'Russia (+7)' },
  { value: 'kz:+7', label: 'Kazakhstan (+7)' },
  { value: '+996', label: 'Kyrgyzstan' },
  { value: '+992', label: 'Tajikistan' }
];

export const PHONE_MASKS: Record<string, string> = {
  '+998': '__ ___ __ __',
  'ru:+7': '(___) ___-__-__',
  'kz:+7': '(___) ___-__-__',
  '+996': '___ ___ ___',
  '+992': '__ ___ __ __'
};

/** Select value -> dialing code. */
export const DIAL_CODES: Record<string, string> = {
  '+998': '998',
  'ru:+7': '7',
  'kz:+7': '7',
  '+996': '996',
  '+992': '992'
};

export const TWO_FA_REQUIRED = '2fa_required';

export const AUTH_ERRORS: Record<string, string> = {
  already_registered: 'This account is already signed in',
  system_busy: 'Authorization is already in progress — enter the code or password',
  invalid_phone_number: 'Invalid phone number',
  rate_limit_exceeded: 'Too many attempts. Please try again later',
  invalid_password: 'Incorrect password',
  invalid_code: 'Invalid code',
  authorization_not_started: 'Authorization expired. Please enter your phone number again',
  timeout: 'Telegram did not respond. Please try again'
};
