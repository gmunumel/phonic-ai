import reducer, { startRecord, stopRecord } from "store/recorderSlice";

test("should handle startRecord", () => {
  expect(reducer({ isRecording: false }, startRecord())).toEqual({
    isRecording: true,
  });
});

test("should handle stopRecord", () => {
  expect(reducer({ isRecording: true }, stopRecord())).toEqual({
    isRecording: false,
  });
});
