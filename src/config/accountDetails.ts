// Centralized account details configuration
// Update these values to change payment account across the entire app

export const ACCOUNT_DETAILS = {
  accountNumber: '6412635787',
  bankName: 'Moniepoint MFB',
  accountName: 'IKECHUKWU CELESTINE OKUMEFUNA'
} as const;

export type AccountDetails = typeof ACCOUNT_DETAILS;
