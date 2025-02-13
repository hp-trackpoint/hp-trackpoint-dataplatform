const debounce = <T extends (...args: any[]) => any>(fun: T, time: number) => {
  let timer: ReturnType<typeof setTimeout> | null = null;
  return function (this: any, ...args: Parameters<T>) {
    if (timer) {
      clearTimeout(timer);
    }
    timer = setTimeout(() => {
      if (fun.constructor.name === 'AsyncFunction') {
        // 如果是异步函数，使用 await 调用
        (async () => {
          await fun.apply(this, args);
        })();
      } else {
        fun.apply(this, args);
      }
      timer = null;
    }, time);
  };
};
export default debounce;
