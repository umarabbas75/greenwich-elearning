const debounce = <T extends (...args: any[]) => void>(fn: T, delay: number) => {
  let timerId: ReturnType<typeof setTimeout>;
  return (...args: Parameters<T>) => {
    clearTimeout(timerId);
    timerId = setTimeout(() => fn(...args), delay);
  };
};

export default debounce;
