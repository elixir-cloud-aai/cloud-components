import React, { useState } from "react";
import { Collapse, Grid, Navbar, Spacer, Text } from "@nextui-org/react";
import {
  useGetToolByIdQuery,
  useGetToolClassesQuery,
  useGetToolsQuery,
  useGetToolVersionQuery,
  useGetToolVersionTestsQuery,
} from "../../api/api";
import ClipboardCopyComponent from "../ClipboardCopyComponent/ClipboardCopyComponent";
import VerticalNavbar from "../Sidebar/Sidebar";
import Sidebar from "../Sidebar/Sidebar";
import Search from "../Search/Search";

interface ToolVersionProps {
  id: string;
  version_id: string;
  type: string;
}

const TRScomponent: React.FC<ToolVersionProps> = () => {
  const { data: toolClassesData = [], isFetching } =
    useGetToolClassesQuery() ?? {};
  const {
    data: toolsData,
    error: toolsError,
    isLoading: toolsLoading,
  } = useGetToolsQuery({ limit: 10, toolClass: "string" }); // we can add params here
  const {
    data: toolByIdData,
    error: toolByIdError,
    isLoading: toolByIdLoading,
  } = useGetToolByIdQuery("JB7HQW");

  if (isFetching || toolsLoading || toolByIdLoading) {
    return <div>Loading...</div>;
  }

  return (
    <Grid.Container gap={1}>
       <Spacer y={1} />
      <Search />
      <Spacer y={1} />
      {toolsData?.map((tool, index) => (
        <Grid
          css={{
            width: "100%",
          }}
          key={index}
        >
          <Collapse bordered title={tool.name} subtitle={tool.description}>
            <>
              <p>Tool ID: {tool.id}</p>
              <p>Has checker: {tool.has_checker ? "Yes" : "No"}</p>
              <p>Meta version: {tool.meta_version}</p>
              <p>Organization: {tool.organization}</p>
              <p>Tool class: {tool.toolclass.name}</p>
              <p>
                URL: <a href={tool.url}>{tool.url}</a>
              </p>

              <>
                <Spacer y={1} />
                <h4>Aliases:</h4>
                {tool.aliases && tool.aliases.length > 0
                  ? tool.aliases.map((alias, index) => (
                      <ClipboardCopyComponent
                        key={index}
                        label={""}
                        value={alias}
                      />
                    ))
                  : "No aliases"}
              </>
              <>
                <Spacer y={1} />
                <h4>Versions:</h4>
                <Sidebar
                  items={
                    toolByIdData?.versions?.map((version, index) => ({
                      title: `Version ${index + 1}`,
                      content: (
                        <div key={index}>
                          <h4>Version {index + 1}</h4>
                          <p>ID: {version.id}</p>
                          <p>Name: {version.name}</p>
                          <p>Meta Version: {version.meta_version}</p>
                          <p>Author: {version.author.join(", ")}</p>
                          <p>
                            Descriptor Type:{" "}
                            {version.descriptor_type.join(", ")}
                          </p>
                          <p>
                            Container File:{" "}
                            {version.containerfile ? "Yes" : "No"}
                          </p>
                          <p>
                            Is Production:{" "}
                            {version.is_production ? "Yes" : "No"}
                          </p>
                          <p>Signed: {version.signed ? "Yes" : "No"}</p>
                          <p>Verified: {version.verified ? "Yes" : "No"}</p>
                          <p>
                            Verified Source:{" "}
                            {version.verified_source.join(", ")}
                          </p>
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
                      ),
                    })) ?? []
                  }
                />
              </>
            </>
          </Collapse>
        </Grid>
      ))}
    </Grid.Container>
  );
};

export default TRScomponent;
