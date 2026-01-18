export const generateTestEmail = (prefix = 'test') => {
  const timestamp = Date.now().toString().slice(-8);
  return `${prefix}${timestamp}@example.com`;
};

export const testData = {
  urls: {
    dashboard: '/dashboard',
    login: '/login',
    signup: '/signup',
    tournaments: '/tournaments',
    leagues: '/leagues',
    myAccount: '/my-account',
  },
  
  timeouts: {
    short: 5000,
    medium: 10000,
    long: 30000,
    auth: 15000,
  },
};
