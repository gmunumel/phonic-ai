import { render, screen } from "@testing-library/react";
import { Provider } from "react-redux";
import { store } from "store/store";
import Manager from "components/Manager";

test("renders header and instructions", () => {
  render(
    <Provider store={store}>
      <Manager />
    </Provider>
  );
  expect(screen.getByText(/Live Audio Transcript/i)).toBeInTheDocument();
  expect(screen.getByText(/How to use it:/i)).toBeInTheDocument();
});
