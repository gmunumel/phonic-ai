import { render, screen } from "@testing-library/react";
import Transcript from "components/Transcript";

jest.mock("services/websockets", () => ({
  onTranscriptionReceived: (cb: any) => {
    cb([
      { id: 1, text: "Hello", start: 0, end: 1.5 },
      { id: 2, text: "World", start: 1.5, end: 2.5 },
    ]);
  },
}));

test("renders transcript segments", () => {
  render(<Transcript />);
  expect(screen.getByText(/Hello/)).toBeInTheDocument();
  expect(screen.getByText(/World/)).toBeInTheDocument();
  expect(screen.getByText("[0.00s - 1.50s]:")).toBeInTheDocument();
  expect(screen.getByText("[1.50s - 2.50s]:")).toBeInTheDocument();
});
