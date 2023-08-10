interface Checksum {
  checksum: string;
  type: string;
}

interface Image {
  checksum: Checksum[];
  image_name: string;
  image_type: string;
  registry_host: string;
  size: number;
  updated: string;
}

interface Version {
  author: string[];
  containerfile: boolean;
  descriptor_type: string[];
  id: string;
  images: Image[];
  included_apps: string[];
  is_production: boolean;
  meta_version: string;
  name: string;
  signed: boolean;
  url: string;
  verified: boolean;
  verified_source: string[];
  isEditing: boolean;
}

interface Tool {
  aliases: string[];
  checker_url: string;
  description: string;
  has_checker: boolean;
  id: string;
  meta_version: string;
  name: string;
  organization: string;
  toolclass: {
    description: string;
    id: string;
    name: string;
  };
  url: string;
  versions: Version[];
}

interface IEnhancedTool extends Tool {
  isEditing: boolean;
  delete(): () => void;
}

interface ToolClass {
  description: string;
  id: string;
  name: string;
}

interface FilterFields {
  key: string;
  name: string;
  textFieldName: string;
  tooltipText: string;
}

export type Omit<T, K extends keyof T> = Pick<T, Exclude<keyof T, K>>;

export type {
  Tool,
  Version,
  Image,
  Checksum,
  ToolClass,
  FilterFields,
  IEnhancedTool,
};
