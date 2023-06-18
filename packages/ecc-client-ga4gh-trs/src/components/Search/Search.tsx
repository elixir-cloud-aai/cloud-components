import { Button, Input, Card, Row, Col } from "@nextui-org/react";
import React, { useState } from "react";
import styles from "./search.module.css";
import { useSearchToolsQuery } from "../../api/api";

interface InputField {
  name: string;
  placeholder: string;
  label: string;
}

const Search = ({ onSearch }) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [showCard, setShowCard] = useState(false);
  const [input, setInput] = useState("");
  const [filterForm, setFilterForm] = useState({
    id: "",
    alias: "",
    toolname: "",
    organization: "",
    description: "",
    checker: false,
    registry: "",
    toolClass: "",
  });

  const { data, error, isLoading, refetch } = useSearchToolsQuery({
    ...filterForm,
    name: searchQuery,
  });

  const toggleCard = () => {
    setShowCard((prevShowCard) => !prevShowCard);
  };

  const inputFields = [
    { name: "id", placeholder: "id", label: "Tool ID" },
    { name: "alias", placeholder: "alias", label: "Alias" },
    { name: "toolname", placeholder: "toolname", label: "Tool Name" },
    {
      name: "organization",
      placeholder: "organization",
      label: "Organization",
    },
    { name: "description", placeholder: "description", label: "Description" },
    { name: "checker", placeholder: "checker", label: "Checker" },
    { name: "registry", placeholder: "registry", label: "Registry" },
    { name: "toolClass", placeholder: "toolclass", label: "Tool Class" },
    { name: "name", placeholder: "name", label: "Name" },
    { name: "limit", placeholder: "limit", label: "Limit" },
    { name: "offset", placeholder: "offset", label: "Offset" },
  ];
  const chunk = (array: InputField[], size: number): InputField[][] => {
    let result: InputField[][] = [];
    for (let i = 0; i < array.length; i += size) {
      result.push(array.slice(i, i + size));
    }
    return result;
  };

  const inputFieldChunks = chunk(inputFields, 4);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFilterForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleChange = (e) => {
    setSearchQuery(e.target.value); 
    onSearch(e.target.value); 
  };

  return (
    <>
      <div className={`${styles.input}`}>
        <Input
          fullWidth
          size="xl"
          placeholder="Search"
          value={searchQuery}
          onChange={handleChange}
          contentLeft={
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              width="24"
              height="24"
            >
              <path d="M10.25 2a8.25 8.25 0 0 1 6.34 13.53l5.69 5.69a.749.749 0 0 1-.326 1.275.749.749 0 0 1-.734-.215l-5.69-5.69A8.25 8.25 0 1 1 10.25 2ZM3.5 10.25a6.75 6.75 0 1 0 13.5 0 6.75 6.75 0 0 0-13.5 0Z"></path>
            </svg>
          }
        />
        <Button
          light
          size="xs"
          icon={
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              width="24"
              height="24"
            >
              <path d="M2.75 6a.75.75 0 0 0 0 1.5h18.5a.75.75 0 0 0 0-1.5H2.75ZM6 11.75a.75.75 0 0 1 .75-.75h10.5a.75.75 0 0 1 0 1.5H6.75a.75.75 0 0 1-.75-.75Zm4 4.938a.75.75 0 0 1 .75-.75h2.5a.75.75 0 0 1 0 1.5h-2.5a.75.75 0 0 1-.75-.75Z"></path>
            </svg>
          }
          onClick={toggleCard}
        />
      </div>
      <div className={styles.filtersCard}>
        {showCard && (
          <Card variant="bordered" className={styles.card}>
            <h3 className={styles.filterHeader}>Filters</h3>
            <div className={styles.inputForm}>
              {inputFieldChunks.map((chunk, chunkIndex) => (
                <Row key={chunkIndex} gap={1}>
                  {chunk.map((field, index) => (
                    <Col key={index} span={8}>
                      <Input
                        fullWidth
                        placeholder={field.placeholder}
                        label={field.label}
                        name={field.name}
                        onChange={handleInputChange}
                        aria-labelledby={index.toString()}
                      />
                    </Col>
                  ))}
                </Row>
              ))}
            </div>
            <Button>apply</Button>
          </Card>
        )}
      </div>
    </>
  );
};

export default Search;
