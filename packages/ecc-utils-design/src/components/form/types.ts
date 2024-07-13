export interface Field {
  key: string;
  label: string;
  type?:
    | "text"
    | "date"
    | "number"
    | "email"
    | "password"
    | "tel"
    | "url"
    | "search"
    | "datetime-local"
    | "time"
    | "array"
    | "switch"
    | "file"
    | "group";
  fieldOptions?: {
    required?: boolean;
    default?: string | boolean;
    multiple?: boolean;
    accept?: string;
    returnIfEmpty?: string;
    tooltip?: string;
  };
  arrayOptions?: {
    defaultInstances?: number;
    max?: number;
    min?: number;
  };
  groupOptions?: {
    collapsible: boolean;
  };
  error?: string;
  children?: Array<Field>;
}
