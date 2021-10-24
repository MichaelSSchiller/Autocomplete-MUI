import React from "react";
import { render, fireEvent } from "@testing-library/react";
import { ThemeProvider } from "@material-ui/core/styles";
import theme from "../theme";
import MultiSelect from "./MultiSelect";
import { SelectOptionType } from "./types";

const label = "Subtype";
const options: SelectOptionType[] = [
  {
    name: "Subtype1",
    id: 1,
  },
  {
    name: "Subtype2",
    id: 2,
  },
  {
    name: "Subtype3",
    id: 3,
  },
  {
    name: "Typetest",
    id: 4,
  },
];

const renderAutoComplete = (value = [options[0], options[1]]) =>
  render(
    <ThemeProvider theme={theme}>
      <MultiSelect
        placeholder=""
        label={label}
        loading={false}
        onChange={jest.fn()}
        options={options}
        value={value}
      />
    </ThemeProvider>,
  );

const renderNewAutoComplete = () =>
  render(
    <ThemeProvider theme={theme}>
      <MultiSelect
        placeholder=""
        label={label}
        loading
        onChange={jest.fn()}
        options={options}
        value={[options[0], options[1]]}
      />
    </ThemeProvider>,
  );
it("should display the label", () => {
  const { getByText } = renderAutoComplete();
  expect(getByText(label)).toBeInTheDocument();
});

it("should display multiple values", () => {
  const { getByText } = renderAutoComplete();
  expect(getByText(options[0].name)).toBeInTheDocument();
  expect(getByText(options[1].name)).toBeInTheDocument();
});

it("should display options", async () => {
  const { findByText, getByLabelText } = renderAutoComplete();
  const button = getByLabelText("Open");
  fireEvent.click(button);
  await expect(findByText("Subtype3")).resolves.toBeInTheDocument();
});

it("should display selected options", async () => {
  const { getByLabelText, findByText, getByText } = renderNewAutoComplete();
  expect(getByText(options[0].name)).toBeInTheDocument();
  expect(getByText(options[1].name)).toBeInTheDocument();
  const button = getByLabelText("Open");
  fireEvent.click(button);
  await expect(findByText("Subtype3")).resolves.toBeInTheDocument();
  fireEvent.click(getByText("Subtype3"));
  expect(getByText(options[2].name)).toBeInTheDocument();
});

it("should display the circular progress icon when data is still loading", () => {
  const { getByLabelText } = renderNewAutoComplete();
  expect(getByLabelText("loading data")).toBeInTheDocument();
});

it("should filter from start of string", async () => {
  const { getByLabelText, findByText, findAllByRole } = renderAutoComplete([]);

  const input = getByLabelText(label);
  fireEvent.change(input, { target: { value: "Sub" } });

  await expect(findByText("Subtype1")).resolves.toBeInTheDocument();
  await expect(findByText("Subtype2")).resolves.toBeInTheDocument();
  await expect(findByText("Subtype3")).resolves.toBeInTheDocument();
  await expect(findAllByRole("option")).resolves.toHaveLength(3);
});

it("should not filter from middle of string", async () => {
  const { getByLabelText, findByText, findAllByRole } = renderAutoComplete([]);

  const input = getByLabelText(label);
  fireEvent.change(input, { target: { value: "type" } });

  await expect(findByText("Typetest")).resolves.toBeInTheDocument();
  await expect(findAllByRole("option")).resolves.toHaveLength(1);
});
