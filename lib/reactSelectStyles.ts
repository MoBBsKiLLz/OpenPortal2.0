import { StylesConfig } from "react-select";
import { OptionType } from "@/src/types/select";

export const singleSelectStyles: StylesConfig<OptionType, false> = {
  control: (styles) => ({
    ...styles,
    backgroundColor: "var(--topbar-bg)",
    borderColor: "var(--hover-bg)",
    color: "var(--text-color)",
  }),
  singleValue: (styles) => ({
    ...styles,
    color: "var(--text-color)", // This fixes the selected value text color
  }),
  menu: (styles) => ({
    ...styles,
    backgroundColor: "var(--menu-bg)",
  }),
  option: (styles, state) => ({
    ...styles,
    backgroundColor: state.isFocused
      ? "var(--menu-hover-bg)"
      : "var(--menu-bg)",
    color: "var(--text-color)",
    cursor: "pointer",
  }),
};

export const multiSelectStyles: StylesConfig<OptionType, true> = {
  control: (styles) => ({
    ...styles,
    backgroundColor: "var(--topbar-bg)",
    borderColor: "var(--hover-bg)",
    color: "var(--text-color)",
  }),
  menu: (styles) => ({
    ...styles,
    backgroundColor: "var(--menu-bg)",
  }),
  option: (styles, state) => ({
    ...styles,
    backgroundColor: state.isFocused
      ? "var(--menu-hover-bg)"
      : "var(--menu-bg)",
    color: "var(--text-color)",
    cursor: "pointer",
  }),
  multiValue: (styles) => ({
    ...styles,
    backgroundColor: "var(--hover-bg)",
  }),
  multiValueLabel: (styles) => ({
    ...styles,
    color: "var(--text-color)",
  }),
};
