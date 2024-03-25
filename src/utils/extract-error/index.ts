const isError = (e: Error): e is Error => {
  return !!(e && e.stack && e.message);
};

export const extractError = (err: unknown): string => {
  if (typeof err === 'string') {
    return err;
  }
  if (err instanceof Error || isError(err as never)) {
    return (err as Error).message;
  }
  return '';
};

const extractDetailsError = (str: string): string => {
  const match = str.match(/Details: (.+?)\n/);
  const matched = match ? match[1] || '' : '';

  if (matched.indexOf('User rejected the request') !== -1) {
    return 'Network switch was canceled by User.';
  }
  return matched;
};

export const parseWagmiError = (err: unknown): string => {
  return extractDetailsError(extractError(err));
};
