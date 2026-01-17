// Centralized account details configuration
// Update these values to change payment account across the entire app

export const ACCOUNT_DETAILS = {
  accountNumber: '5569742889',
  bankName: 'Moniepoint MFB',
  accountName: 'SUNDAY LIBERTY'
} as const;

export type AccountDetails = typeof ACCOUNT_DETAILS;
