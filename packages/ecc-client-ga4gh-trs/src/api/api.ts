// // api.ts
// import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'

// export const api = createApi({
//   reducerPath: 'api',
//   baseQuery: fetchBaseQuery({ baseUrl: 'https://trs-filer-test.rahtiapp.fi/ga4gh/trs/v2/' }),
//   endpoints: (builder) => ({
//     getToolClasses: builder.query<Array<{description: string, id: string, name: string}>, void>({
//       query: () => 'toolClasses',
//     }),
//   }),
// })

// export const { useGetToolClassesQuery } = api

// api.ts
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'

interface ToolsParams {
  id?: string;
  alias?: string;
  toolClass?: string;
  descriptorType?: string;
  registry?: string;
  organization?: string;
  nameOfImage?: string;
  toolname?: string;
  descriptor?: string;
  author?: string;
  checker?: boolean;
  offset?: string;
  limit?: number;
}

interface Image {
  checksum: Array<{checksum: string, type: string}>;
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

interface ToolClass {
  description: string;
  id: string;
  name: string;
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
  toolclass: ToolClass;
  url: string;
  versions: Version[];
}


export const api = createApi({
  reducerPath: 'api',
  baseQuery: fetchBaseQuery({ baseUrl: 'https://trs-filer-test.rahtiapp.fi/ga4gh/trs/v2/' }),
  endpoints: (builder) => ({
    getToolClasses: builder.query<Array<{description: string, id: string, name: string}>, void>({
      query: () => 'toolClasses',
    }),
    getTools: builder.query<Array<any>, ToolsParams>({
      query: (params) => {
        const query = new URLSearchParams(params as Record<string, string>);
        return `tools?${query.toString()}`;
      },
    }),
    getToolById: builder.query<Tool, string>({
      query: (id) => `tools/${id}`,
    }),
  }),
})

export const { useGetToolClassesQuery, useGetToolsQuery, useGetToolByIdQuery } = api
