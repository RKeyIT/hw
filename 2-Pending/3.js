const myIterable = {
  from: 1,
  to: 4,
  [Symbol.iterator]() {
    let from = this.from;
    let to = this.to;

    if (!Number.isSafeInteger(from) || !Number.isSafeInteger(to) || to < from) {
      throw new Error('Некорректные значения from и to');
    }

    return {
      next: () => {
        if (from <= to) {
          return {
            value: from++,
            done: false,
          };
        } else {
          return { done: true };
        }
      },
    };
  },
};

for (const iterator of myIterable) {
  console.log(iterator);
}
