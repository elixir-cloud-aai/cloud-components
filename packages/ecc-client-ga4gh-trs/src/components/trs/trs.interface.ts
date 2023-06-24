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
}

interface Image {
  checksum: Checksum[];
  image_name: string;
  image_type: string;
  registry_host: string;
  size: number;
  updated: string;
}

interface Checksum {
  checksum: string;
  type: string;
}

// export default Tool,
// export all interfaces below
export type { Tool, Version, Image, Checksum };

