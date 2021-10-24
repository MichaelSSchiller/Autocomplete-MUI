import React from "react";
//  External Components
import makeStyles from "@material-ui/core/styles/makeStyles";
import Autocomplete, {
  AutocompleteRenderInputParams,
  AutocompleteRenderOptionState,
} from "@material-ui/lab/Autocomplete";
import {
  UseAutocompleteProps,
  createFilterOptions,
} from "@material-ui/lab/useAutocomplete";
import CircularProgress from "@material-ui/core/CircularProgress";
import highlightWords from "highlight-words";
// Icons
import ArrowDropDownIcon from "@material-ui/icons/ArrowDropDown";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTimes } from "@fortawesome/free-solid-svg-icons";
// Types
import { Theme } from "@material-ui/core/styles/createMuiTheme";
import { SelectOptionType, CommonSelectProps } from "./types";
// Internal
import RenderInput from "./RenderInput";

const useStyles = makeStyles(
  ({ spacing, palette: { primary, grey, text } }: Theme) => ({
    inputSearch: {
      paddingRight: `${spacing(0)} !important`,
    },
    option: {
      padding: spacing(0.5, 1, 0.5, 1),
      display: "block",
      overflow: "hidden",
      textOverflow: "ellipsis",
      whiteSpace: "nowrap",
      "&:hover": {
        backgroundColor: grey[500],
        color: text.primary,
      },
      "&[aria-selected=true]": {
        backgroundColor: primary.main,
        color: primary.contrastText,
      },
    },
    inputFocused: {
      // IE: 11 & Edge: Remove Clearable X
      "&::-ms-clear": {
        display: "none",
      },
    },
    highlightText: {
      fontWeight: "bold",
    },
  }),
);

export default ({
  error,
  helperText,
  highlight,
  inputSearch,
  inputValue,
  label,
  loading = false,
  onChange,
  options,
  placeholder,
  required,
  value,
  ...autocompleteParams
}: MultiSelectProps) => {
  const renderInput = (params: AutocompleteRenderInputParams) => (
    <RenderInput
      error={error}
      helperText={helperText}
      inputSearch={inputSearch}
      label={label}
      placeholder={value && value.length === 0 ? placeholder : ""}
      renderInputParams={params}
      required={required}
    />
  );

  const handleChange: UseAutocompleteProps<
    SelectOptionType,
    true,
    true,
    true
  >["onChange"] = (e, selectedOptions) => {
    const cleanedOptions = selectedOptions.reduce<SelectOptionType[]>(
      (cleanArr, currentOption) => {
        if (typeof currentOption !== "string") {
          cleanArr.push(currentOption);
        }
        return cleanArr;
      },
      [],
    );
    if (onChange) onChange(cleanedOptions);
  };

  const filterOptions = createFilterOptions<SelectOptionType>({
    matchFrom: "start",
  });

  const renderOption = (
    option: SelectOptionType,
    state: AutocompleteRenderOptionState,
  ) => {
    const chunks = highlightWords({
      text: option.name,
      query: state.inputValue,
    });

    return (
      <div>
        {chunks.map((chunk) => (
          <span
            key={chunk.key}
            className={
              chunk.match && highlight ? classes.highlightText : undefined
            }
          >
            {chunk.text}
          </span>
        ))}
      </div>
    );
  };

  const classes = useStyles();

  return (
    <Autocomplete
      ChipProps={{
        deleteIcon: <FontAwesomeIcon icon={faTimes} size="xs" />,
        size: "small",
      }}
      classes={{
        ...(inputSearch && { inputRoot: classes.inputSearch }),
        option: classes.option,
        inputFocused: classes.inputFocused,
      }}
      clearOnBlur
      disableClearable
      disableCloseOnSelect
      forcePopupIcon
      freeSolo
      fullWidth
      // NOTE freeSolo removes noOptionsText component
      // Workaround: return a custom option and disable it
      filterOptions={(opts, params) => {
        if (opts.length === 0) return [{ id: 0, name: "No options" }];
        if (highlight) return opts;
        return filterOptions(opts, params);
      }}
      getOptionDisabled={({ id }) => id === 0}
      getOptionLabel={({ name }) => name}
      getOptionSelected={(option, selected) => option.id === selected.id}
      inputValue={inputValue}
      loading={loading}
      multiple
      onChange={handleChange}
      options={options}
      popupIcon={
        loading ? (
          <CircularProgress
            size="1.25rem"
            aria-label="loading data"
            color="inherit"
          />
        ) : (
          <ArrowDropDownIcon />
        )
      }
      renderInput={renderInput}
      value={value}
      {...(highlight && { renderOption })}
      {...autocompleteParams}
    />
  );
};

export type CommonMultiSelectProps = CommonSelectProps<SelectOptionType, true> &
  Pick<UseAutocompleteProps<SelectOptionType, true, true, true>, "value">;

export type MultiSelectProps = CommonMultiSelectProps &
  Omit<
    UseAutocompleteProps<SelectOptionType, true, true, true>,
    "multiple" | "onChange" | "value"
  >;
