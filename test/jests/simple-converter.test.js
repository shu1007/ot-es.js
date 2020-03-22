import { toOperation, fromOperation } from "common/simple-converter";

const sampleText = `aaaa\naaaa\naaaa`;
const deleteChange = {
  from: { line: 0, ch: 0 },
  to: { line: 1, ch: 0 },
  deleteLength: 5,
  text: ""
};

const insertChange = {
  from: { line: 2, ch: 4 },
  deleteLength: 0,
  text: "\naaaaa"
};

describe("toOperation", () => {
  const assertOperation = (ope, str) => {
    expect(ope.apply(sampleText)).toEqual(str);
  };
  test("delete", () => {
    const expectStr = "aaaa\naaaa";
    assertOperation(toOperation(deleteChange, expectStr), expectStr);
  });
  test("insert", () => {
    const expectStr = "aaaa\naaaa\naaaa\naaaaa";
    assertOperation(toOperation(insertChange, expectStr), expectStr);
  });
});

describe("fromOperation", () => {
  const assertChange = (change, expectChange) => {
    expect(change).toEqual(expectChange);
  };
  test("delete", () => {
    const changed = "aaaa\naaaa";
    assertChange(
      fromOperation(toOperation(deleteChange, changed), sampleText)[0],
      deleteChange
    );
  });
  test("insert", () => {
    const changed = "aaaa\naaaa\naaaa\naaaaa";
    assertChange(
      fromOperation(toOperation(insertChange, changed), sampleText)[0],
      insertChange
    );
  });
  test("");
});
// const applyOperation = ope => {
//   ope.ops.forEach(op => console.log(op));
//   console.log(`baseLength${ope.baseLength}`);
//   console.log(`targerLength${ope.targetLength}`);
//   console.log("***result***");
//   console.log(ope.apply(SampleText));
//   console.log("************");
// };

// const showChanges = changes => {
//   console.log("***showChange***");
//   changes.forEach(change => {
//     console.log(`from.line:${change.from.line}, from.ch:${change.from.ch}`);
//     if (change.to !== undefined)
//       console.log(`to.line:${change.to.line}, to.ch:${change.to.ch}`);

//     console.log(`text:${change.text}`);
//     console.log(`deleteLength:${change.deleteLength}`);
//   });
//   console.log("****************");
// };
// const ope1 = ot.toOperation(deleteFirstLine, "aaaa\naaaa");
// applyOperation(ope1);
// const changes1 = ot.fromOperation(ope1, SampleText);
// showChanges(changes1);

// const ope2 = ot.toOperation(insertChange, "aaaa\naaaa\naaaa\naaaaa");
// applyOperation(ope2);
// const changes2 = ot.fromOperation(ope2, SampleText);
// showChanges(changes2);

// const ope3 = new ot.TextOperation()
//   .delete("aa")
//   .insert("bb")
//   .retain(12);
// console.log(ope3.apply(SampleText));
// showChanges(ot.fromOperation(ope3, SampleText));
