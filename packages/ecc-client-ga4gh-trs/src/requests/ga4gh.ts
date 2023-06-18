import type { IToolClass, IToolParams } from "../ts/types";
import { api } from "./api";

export const getToolClasses = (): Promise<IToolClass[]> => {
  return api.get("/toolClasses").then((res) => res.data);
};

export const getTools = (params: IToolParams) => {
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
  return api.get(`/tools?${queryParams}`).then((res) => res.data);
};

export const getToolById = (id: string) => {
  return api.get(`/tools/${id}`).then((res) => res.data);
};
