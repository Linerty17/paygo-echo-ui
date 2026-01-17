// Centralized account details configuration
// Update these values to change payment account across the entire app

export const ACCOUNT_DETAILS = {
  accountNumber: '6563311334',
  bankName: 'Moniepoint MFB',
  accountName: 'Ifechukwu Destiny Sunday'
} as const;

export type AccountDetails = typeof ACCOUNT_DETAILS;
