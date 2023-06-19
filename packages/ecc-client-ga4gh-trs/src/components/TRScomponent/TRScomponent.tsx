import React, { useCallback, useEffect, useState } from "react";
import { Collapse, Grid, Pagination, Spacer } from "@nextui-org/react";
import ClipboardCopyComponent from "../ClipboardCopyComponent/ClipboardCopyComponent";
import Sidebar from "../Sidebar/Sidebar";
import Search from "../Search/Search";
import { getToolById, getTools } from "../../requests/ga4gh";
import styles from "./trs-component.module.css";


interface ToolVersionProps {
  id: string;
  version_id: string;
  type: string;
}

const TRScomponent: React.FC<ToolVersionProps> = () => {
  const [searchText, setSearchText] = useState("");
  const [filterForm, setFilterForm] = useState({
    id: "",
    alias: "",
    toolname: "",
    organization: "",
    description: "",
    checker: undefined,
    registry: "",
    toolClass: "string",
    limit: 5,
    offset: "0",
  });
  const [filteredTools, setFilteredTools] = useState<any>([]);
  const [selectedTool, setSelectedTool] = useState<any>(undefined);

  useEffect(() => {
    getTools(filterForm).then((res) => {
      setFilteredTools(res);
    });
  }, []);

  const handleSearchText = useCallback((text) => {
    setSearchText(text);
  }, []);

  useEffect(() => {
    if (filteredTools.length > 0) {
      setFilteredTools(
        filteredTools.filter((tool) =>
          tool.name.toLowerCase().includes(searchText.toLowerCase())
        )
      );
    }
  }, [searchText]);

  const handleApply = () => {
    getTools(filterForm).then((res) => {
      setFilteredTools(res);
    });
  };

  const handleClick = (toolId: string) => {
    getToolById(toolId).then((res) => {
      setSelectedTool(res);
    });
  };

  return (
    <Grid.Container gap={1}>
      <Spacer y={1} />
      <Search
        onSearch={handleSearchText}
        form={filterForm}
        setForm={setFilterForm}
        onApply={handleApply}
      />
      <Spacer y={1} />
      {filteredTools?.map((tool) => (
        <Grid
          css={{
            width: "100%",
          }}
          key={tool.id}
          onClick={() => handleClick(tool.id)}
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
                {selectedTool?.versions ? (
                  <Sidebar
                    items={
                      selectedTool?.versions?.map((version, index) => ({
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
                ) : null}
              </>
            </>
          </Collapse>
        </Grid>
      ))}
      <Spacer y={1} />
      <div className={styles.pagination}>
      <Pagination 
        total={Math.ceil(filteredTools.length / filterForm.limit)}
        initialPage={1}
        onChange={(e) => {
          setFilterForm((prev) => ({
            ...prev,
            offset: String((e - 1) * prev.limit),
          }));
        }}
      /></div>
    </Grid.Container>
  );
};

export default TRScomponent;
