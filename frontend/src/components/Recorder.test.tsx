import { render, screen } from "@testing-library/react";
import { Provider } from "react-redux";
import { store } from "store/store";
import Recorder from "components/Recorder";

test("renders REC button", () => {
  render(
    <Provider store={store}>
      <Recorder />
    </Provider>
  );
  const recLabel = screen.getByTestId("rec-label");
  expect(recLabel).toHaveTextContent(/rec/i);
});
