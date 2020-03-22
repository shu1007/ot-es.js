import { toOperation, fromOperation } from 'common/simple-converter';

const sampleText = `aaaa\naaaa\naaaa`;
const deleteChange = {
  from: { line: 0, ch: 0 },
  to: { line: 1, ch: 0 },
  deleteLength: 5,
  text: ''
};

const insertChange = {
  from: { line: 2, ch: 4 },
  deleteLength: 0,
  text: '\naaaaa'
};

describe('toOperation', () => {
  const assertOperation = (ope, str) => {
    expect(ope.apply(sampleText)).toEqual(str);
  };
  test('delete', () => {
    const expectStr = 'aaaa\naaaa';
    assertOperation(toOperation(deleteChange, expectStr), expectStr);
  });
  test('insert', () => {
    const expectStr = 'aaaa\naaaa\naaaa\naaaaa';
    assertOperation(toOperation(insertChange, expectStr), expectStr);
  });
});

describe('fromOperation', () => {
  const assertChange = (change, expectChange) => {
    expect(change).toEqual(expectChange);
  };
  test('delete', () => {
    const changed = 'aaaa\naaaa';
    assertChange(
      fromOperation(toOperation(deleteChange, changed), sampleText)[0],
      deleteChange
    );
  });
  test('insert', () => {
    const changed = 'aaaa\naaaa\naaaa\naaaaa';
    assertChange(
      fromOperation(toOperation(insertChange, changed), sampleText)[0],
      insertChange
    );
  });
});
