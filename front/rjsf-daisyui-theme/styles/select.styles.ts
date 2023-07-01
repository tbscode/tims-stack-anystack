import { GroupBase, StylesConfig } from "react-select";
import { Option } from "../../../interfaces/Option.interface";

export const selectStyles:StylesConfig<Option, boolean, GroupBase<Option>> = {
    option: (provided, state) => ({}),
    menu: (provided, state) => ({}),
    menuList: (provided, state) => ({}),
    menuPortal: (provided, state) => ({
        ...provided,
        // background: "purple",
    }),
    input : (provided, state) => ({}),
    control: (provided) => ({}),
    group: (provided) => ({
        ...provided,
        background: "green",
    }),
    groupHeading: (provided) => ({
        ...provided,
        background: "green",
    }),
    indicatorsContainer: (provided) => ({
    }),
    singleValue: (provided, state) => ({}),
    valueContainer: (provided, state) => ({}),
    multiValue: (provided) => ({}),
    multiValueLabel: (provided, { data }) => ({}),
    multiValueRemove: (provided, { data }) => ({}),
  }
  