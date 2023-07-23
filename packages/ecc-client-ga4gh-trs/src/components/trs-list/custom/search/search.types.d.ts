interface FilterParams {
  id: string;
  alias: string;
  toolClass: string;
  descriptorType: string;
  registry: string;
  organization: string;
  name: string;
  description: string;
  author: string;
  checker: undefined | string;
  offset: string;
}

export type { FilterParams };
