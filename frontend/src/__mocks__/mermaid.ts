const mermaid = {
  initialize: jest.fn(() => {}),
  render: jest.fn(() => {
    return Promise.resolve({ svg: "<svg></svg>", bindFunctions: jest.fn() });
  }),
};

export default mermaid;
module.exports = mermaid;
module.exports.default = mermaid;
