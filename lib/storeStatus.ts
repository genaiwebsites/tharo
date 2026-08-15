import { StoreStatus } from './types';

export function computeStoreStatus(): StoreStatus {
  const now = new Date();
  // Kolkata IST is UTC + 5:30
  const ist = new Date(now.getTime() + (now.getTimezoneOffset() * 60000) + (5.5 * 3600000));
  const day = ist.getDay();
  const mins = ist.getHours() * 60 + ist.getMinutes();

  if (day === 0) {
    return {
      open: false,
      short: 'Sunday — by appointment',
      long: 'Sunday · by appointment only'
    };
  }

  // 11:30 AM = 690 mins, 7:30 PM = 1170 mins
  const open = mins >= 690 && mins < 1170;
  if (open) {
    return {
      open: true,
      short: 'Open · until 7:30 PM',
      long: 'Open now · until 7:30 PM IST'
    };
  }

  const before = mins < 690;
  return {
    open: false,
    short: before ? 'Opens 11:30 AM' : 'Closed · opens 11:30 AM',
    long: before ? 'Closed · opens 11:30 AM IST' : 'Closed for the day · opens 11:30 AM IST'
  };
}
