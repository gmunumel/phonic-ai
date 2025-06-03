import { render, waitFor } from "@testing-library/react";
import SequenceDiagram from "components/SequenceDiagram";
import mermaid from "mermaid";
import { Provider } from "react-redux";
import { store } from "store/store";

test("mermaid mock is used", () => {
  expect(jest.isMockFunction(mermaid.render)).toBe(true);
});

test("mermaid render is called", async () => {
  render(
    <Provider store={store}>
      <SequenceDiagram />
    </Provider>
  );

  await waitFor(() => {
    expect(mermaid.render).toHaveBeenCalled();
  });
});
