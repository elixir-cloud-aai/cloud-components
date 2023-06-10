import React from "react";
import {
  useGetToolByIdQuery,
  useGetToolClassesQuery,
  useGetToolsQuery,
  
} from "../../api/api";

const ToolClassesComponent: React.FC = () => {
  const { data: toolClassesData = [], isFetching } =
    useGetToolClassesQuery() ?? {};
  const {
    data: toolsData,
    error: toolsError,
    isLoading: toolsLoading
  } = useGetToolsQuery({ limit: 10, toolClass: "string" }); // we can add params here
  const {
    data: toolByIdData,
    error: toolByIdError,
    isLoading: toolByIdLoading
  } = useGetToolByIdQuery("JB7HQW");

  if (isFetching || toolsLoading || toolByIdLoading) {
    return <div>Loading...</div>;
  }

  return (
    <>
      <div>
        <h1>Tool Classes</h1>
        {toolClassesData.map((toolClass) => (
          <div key={toolClass.id}>
            <h2>Id of the toolClass: {toolClass.id}</h2>
            <p>Name of the toolClass: {toolClass.name}</p>
            <p>Description of the toolClass: {toolClass.description}</p>
          </div>
        ))}
      </div>
      <div>
        <h1>Tools</h1>
        {toolsData?.map((tool, index) => (
          <div key={index}>
            <h2>{tool.name}</h2>
            <p>Description: {tool.description}</p>
            <p>ID: {tool.id}</p>
            <p>
              Alias: {tool.aliases ? tool.aliases.join(", ") : "No aliases"}
            </p>
            <p>Has checker: {tool.has_checker ? "Yes" : "No"}</p>
            <p>Meta version: {tool.meta_version}</p>
            <p>Organization: {tool.organization}</p>
            <p>Tool class: {tool.toolclass.name}</p>
            <p>
              URL: <a href={tool.url}>{tool.url}</a>
            </p>
          </div>
        ))}
      </div>
      <div>
        <h1>Tool by ID</h1>
        <h2>{toolByIdData?.name}</h2>
        <p>ID: {toolByIdData?.id}</p>
        <p>Description: {toolByIdData?.description}</p>
        <p>Organization: {toolByIdData?.organization}</p>
        <p>Meta Version: {toolByIdData?.meta_version}</p>
        <p>Has Checker: {toolByIdData?.has_checker ? "Yes" : "No"}</p>
        <p>Checker URL: {toolByIdData?.checker_url}</p>
        <p>URL: {toolByIdData?.url}</p>
        <p>Aliases: {toolByIdData?.aliases.join(", ")}</p>
        <h3>Tool Class:</h3>
        <p>Description: {toolByIdData?.toolclass.description}</p>
        <p>ID: {toolByIdData?.toolclass.id}</p>
        <p>Name: {toolByIdData?.toolclass.name}</p>
        <h3>Versions:</h3>
        {toolByIdData?.versions.map((version, index) => (
          <div key={index}>
            <h4>Version {index + 1}</h4>
            <p>ID: {version.id}</p>
            <p>Name: {version.name}</p>
            <p>Meta Version: {version.meta_version}</p>
            <p>Author: {version.author.join(", ")}</p>
            <p>Descriptor Type: {version.descriptor_type.join(", ")}</p>
            <p>Container File: {version.containerfile ? "Yes" : "No"}</p>
            <p>Is Production: {version.is_production ? "Yes" : "No"}</p>
            <p>Signed: {version.signed ? "Yes" : "No"}</p>
            <p>Verified: {version.verified ? "Yes" : "No"}</p>
            <p>Verified Source: {version.verified_source.join(", ")}</p>
            <p>URL: {version.url}</p>
            <h5>Images:</h5>
            {version.images.map((image, imageIndex) => (
              <div key={imageIndex}>
                <p>Image Name: {image.image_name}</p>
                <p>Image Type: {image.image_type}</p>
                <p>Registry Host: {image.registry_host}</p>
                <p>Size: {image.size}</p>
                <p>Updated: {image.updated}</p>
                <p>
                  Checksum:{" "}
                  {image.checksum
                    .map((c) => `${c.type}: ${c.checksum}`)
                    .join(", ")}
                </p>
              </div>
            ))}
            <h5>Included Apps:</h5>
            <ul>
              {version.included_apps.map((app, appIndex) => (
                <li key={appIndex}>{app}</li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </>
  );
};

export { ToolClassesComponent };
