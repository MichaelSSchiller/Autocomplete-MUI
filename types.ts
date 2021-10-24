import { AutocompleteProps } from "@material-ui/lab/Autocomplete";
import { RenderInputProps } from "./RenderInput";

export interface SelectOptionType {
  id: number;
  name: string;
}
export interface CommonSelectProps<TVar, Multiple extends boolean>
  extends Pick<
      AutocompleteProps<TVar, Multiple, true, false>,
      "id" | "loading" | "disabled" | "inputValue" | "onInputChange"
    >,
    Omit<RenderInputProps, "renderInputParams" | "onChange"> {
  onChange?: (option: Multiple extends true ? Array<TVar> : TVar) => void;
  highlight?: boolean;
  inputSearch?: boolean;
}
