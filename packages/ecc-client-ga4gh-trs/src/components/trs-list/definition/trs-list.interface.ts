interface IChecksum {
  checksum: string;
  type: string;
}

interface IImage {
  checksum: IChecksum[];
  image_name: string;
  image_type: string;
  registry_host: string;
  size: number;
  updated: string;
}

interface IVersion {
  author: string[];
  containerfile: boolean;
  descriptor_type: string[];
  id: string;
  images: IImage[];
  included_apps: string[];
  is_production: boolean;
  meta_version: string;
  name: string;
  signed: boolean;
  url: string;
  verified: boolean;
  verified_source: string[];
}

interface ITool {
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
  versions: IVersion[];
}

interface IToolClass {
  description: string;
  id: string;
  name: string;
}

export type { ITool, IVersion, IImage, IChecksum, IToolClass };
