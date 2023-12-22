function getType(el) {
  return Object.prototype.toString
    .call(el)
    .replace(/.\w*.([A-Z]\w*)./, '$1')
    .toLowerCase();
}

function makeObjectDeepCopy(object) {
  if (typeof object !== 'object') {
    return object;
  }

  if (getType(object) === 'object') {
    for (const key in object) {
      makeObjectDeepCopy({ ...object[key] });
    }
  }

  if (getType(object) === 'array') {
    return [...object].map(makeObjectDeepCopy);
  }

  return object;
}
