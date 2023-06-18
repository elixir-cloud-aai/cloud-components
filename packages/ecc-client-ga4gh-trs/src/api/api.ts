import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

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

interface Image {
  checksum: Array<{ checksum: string; type: string }>;
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
}

export interface ToolClass {
  description: string;
  id: string;
  name: string;
}

export interface Tool {
  aliases: string[];
  checker_url: string;
  description: string;
  has_checker: boolean;
  id: string;
  meta_version: string;
  name: string;
  organization: string;
  toolclass: ToolClass;
  url: string;
  versions: Version[];
}

export interface ToolVersionParams {
  id: string;
  version_id: string;
  type: string;
}

export const api = createApi({
  reducerPath: "api",
  baseQuery: fetchBaseQuery({
    baseUrl: "https://trs-filer-test.rahtiapp.fi/ga4gh/trs/v2/",
  }),
  endpoints: (builder) => ({
    getToolClasses: builder.query<
      Array<{ description: string; id: string; name: string }>,
      void
    >({
      query: () => "toolClasses",
    }),
    getTools: builder.query<Array<any>, IToolParams>({
      query: (params) => {
        const {
          id,
          alias,
          toolname,
          organization,
          description,
          checker,
          registry,
          toolClass,
          limit = 10,
          offset,
        } = params;
        const queryParams = [
          id && `id=${id}`,
          alias && `alias=${alias}`,
          toolname && `toolname=${toolname}`,
          organization && `organization=${organization}`,
          description && `description=${description}`,
          checker && `checker=${checker}`,
          registry && `registry=${registry}`,
          toolClass && `toolClass=${toolClass}`,
          limit && `limit=${limit}`,
          offset && `offset=${offset}`,
        ]
          .filter(Boolean)
          .join("&");
        return `tools?${queryParams}`;
      },
    }),
    getToolById: builder.query<Tool, string>({
      query: (id) => `tools/${id}`,
    }),
    getToolVersion: builder.query<
      Array<{ file_type: string; path: string }>,
      ToolVersionParams
    >({
      query: ({ id, version_id, type }) =>
        `tools/${id}/versions/${version_id}/${type}/files`,
    }),
    getToolVersionTests: builder.query<Array<any>, ToolVersionParams>({
      query: ({ id, version_id, type }) =>
        `tools/${id}/versions/${version_id}/${type}/tests`,
    }),
  }),
});

export const {
  useGetToolClassesQuery,
  useGetToolsQuery,
  useGetToolByIdQuery,
  useGetToolVersionQuery,
  useGetToolVersionTestsQuery,
} = api;
