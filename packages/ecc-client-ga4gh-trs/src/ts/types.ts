export interface IToolClass {
  description: string;
  id: string;
  name: string;
}

export interface IToolParams {
  id?: string;
  alias?: string;
  toolClass?: string;
  descriptorType?: string;
  registry?: string;
  organization?: string;
  name?: string;
  toolname?: string;
  description?: string;
  author?: string;
  checker?: boolean;
  offset?: string;
  limit?: number;
}
