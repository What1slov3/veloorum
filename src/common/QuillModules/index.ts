import Delta from 'quill-delta';

const matchIgnore = (node: Node, delta: Delta) => {
  let ops: Delta['ops'] = [];
  delta.ops.forEach((op) => {
    if (op.insert && typeof op.insert === 'string') {
      ops.push({
        insert: op.insert,
      });
    }
  });
  delta.ops = ops;
  return delta;
};

export const quillModules = {
  toolbar: false,
  clipboard: {
    matchers: [[Node.ELEMENT_NODE, matchIgnore]],
    matchVisual: false,
  },
  history: {
    delay: 1000,
    maxStack: 100,
    userOnly: true,
  },
  keyboard: {
    bindings: {
      tab: {
        key: 9,
        handler: function (range: any, context: any) {
          return true;
        },
      },
      enter: {
        key: 13,
        shiftKey: false,
        handler: function (range: any, context: any) {
          return false;
        },
      },
    },
  },
};
