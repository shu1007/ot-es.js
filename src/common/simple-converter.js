/*
The code based on codemirror-adapter.
The following objects and TextOperation are mutually converted.

change = {
  from: position
  to: position | undefind
  text: string
  deleteLength: number
}
position = {line: number, ch: number}
*/

import TextOperation from './text-operation';

export const toOperation = (change, fullText) => {
  const textEndLength = sumLengths(fullText.split('\n'));
  let operation = new TextOperation().retain(textEndLength);

  const indexFromPos = function(pos) {
    const textArray = fullText.split('\n');
    const line = pos.line;
    let count = 0;
    for (let i = 0; i < line; i++) {
      count += textArray[i].length;
    }
    count += line + pos.ch;
    return count;
  };

  function sumLengths(strArr) {
    if (strArr.length === 0) {
      return 0;
    }
    let sum = 0;
    for (let i = 0; i < strArr.length; i++) {
      sum += strArr[i].length;
    }
    return sum + strArr.length - 1;
  }

  const fromIndex = indexFromPos(change.from);
  const restLength =
    textEndLength - fromIndex - sumLengths(change.text.split('\n'));

  operation = new TextOperation()
    .retain(fromIndex)
    ['delete'](change.deleteLength)
    .insert(change.text)
    .retain(restLength)
    .compose(operation);

  return operation;
};

export const fromOperation = function(operation, fullText) {
  const posFromIndex = index => {
    let line = 0;
    let ch = 0;
    let sum = 0;
    const textArray = fullText.split('\n');
    for (let i = 0; i < textArray.length; i++) {
      const lineLength = textArray[i].length;
      if (sum + lineLength >= index) {
        ch = index - sum;
        break;
      }
      line++;
      sum += lineLength + 1;
    }
    return { line: line, ch: ch };
  };
  const ops = operation.ops;
  const changes = [];
  let index = 0;
  for (let i = 0, l = ops.length; i < l; i++) {
    const op = ops[i];
    if (TextOperation.isRetain(op)) {
      index += op;
    } else if (TextOperation.isInsert(op)) {
      const indexPos = posFromIndex(index);
      changes.push({
        from: {
          line: indexPos.line,
          ch: indexPos.ch
        },
        text: op,
        deleteLength: 0
      });
      index += op.length;
      const first = fullText.slice(0, index);
      const last = fullText.slice(index);
      fullText = first + op + last;
    } else if (TextOperation.isDelete(op)) {
      const from = posFromIndex(index);
      const to = posFromIndex(index - op);
      changes.push({
        from: {
          line: from.line,
          ch: from.ch
        },
        to: {
          line: to.line,
          ch: to.ch
        },
        deleteLength: -op,
        text: ''
      });

      const first = fullText.slice(0, index);
      const last = fullText.slice(index - op);
      fullText = first + last;
    }
  }

  return changes;
};
