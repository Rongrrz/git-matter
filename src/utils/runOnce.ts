export function runOnce<TArgs extends unknown[]>(
  callback: (...args: TArgs) => void,
) {
  let hasRun = false;

  return (...args: TArgs) => {
    if (hasRun) {
      return;
    }

    hasRun = true;
    callback(...args);
  };
}
