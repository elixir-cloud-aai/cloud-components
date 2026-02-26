const fs = require("fs");
const path = require("path");

const mockDir = path.join(__dirname, "..", "mocks", "ga4gh-trs");

const files = {
  "toolClasses/get.json":
    '[{"id": "mock-class", "name": "Mock Class", "description": "Mock class description"}]',
  "tools/get.json":
    '[{"id": "mock-tool-001", "name": "Mock Tool", "organization": "Mock Org"}]',
  "tools/id.json":
    '{"id": "mock-tool-001", "name": "Mock Tool", "organization": "Mock Org", "description": "A mocked tool"}',
  "tools/versions.json":
    '[{"id": "v1", "name": "Version 1.0", "author": ["Mock Author"]}]',
  "tools/version-id.json":
    '{"id": "v1", "name": "Version 1.0", "author": ["Mock Author"], "is_production": true}',
  "tools/files.json": '[{"path": "/mock/file.txt", "file_type": "TEST_FILE"}]',
  "tools/descriptor.json":
    '{"content": "mock descriptor content", "url": "/mocks/ga4gh-trs/tools/mock-content.txt"}',
  "tools/descriptor-path.json":
    '{"content": "mock descriptor by path", "url": "/mocks/ga4gh-trs/tools/mock-content.txt"}',
  "tools/containerfile.json":
    '[{"content": "FROM ubuntu:latest\\nRUN echo mock", "url": "/mocks/ga4gh-trs/tools/mock-content.txt"}]',
  "tools/tests.json":
    '[{"content": "mock test content", "url": "/mocks/ga4gh-trs/tools/mock-content.txt"}]',
  "tools/mock-content.txt": "Mocked file content for GA4GH TRS file wrappers.",
};

for (const [relativePath, content] of Object.entries(files)) {
  const fullPath = path.join(mockDir, relativePath);
  fs.mkdirSync(path.dirname(fullPath), { recursive: true });
  fs.writeFileSync(fullPath, content);
}

console.log("Created GA4GH TRS mock files");
