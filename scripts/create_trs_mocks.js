const fs = require("fs");
const path = require("path");

const mockDir = path.join(__dirname, "..", "mocks", "elixir-trs-filer");

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
    '{"content": "mock descriptor content", "url": "https://example.com/descriptor"}',
  "tools/descriptor-path.json":
    '{"content": "mock descriptor by path", "url": "https://example.com/descriptor"}',
  "tools/containerfile.json":
    '[{"content": "FROM ubuntu:latest\\nRUN echo mock", "url": "https://example.com/containerfile"}]',
  "tools/tests.json":
    '[{"content": "mock test content", "url": "https://example.com/test"}]',
  "tools/post.json": '{"id": "mock-tool-new-post"}',
  "tools/put.json": '{"id": "mock-tool-put-updated"}',
  "tools/versions-post.json": '{"id": "mock-version-post"}',
  "tools/versions-put.json": '{"id": "mock-version-put"}',
  "toolClasses/post.json": '{"id": "mock-toolclass-post"}',
  "toolClasses/put.json": '{"id": "mock-toolclass-put"}',
};

for (const [relativePath, content] of Object.entries(files)) {
  const fullPath = path.join(mockDir, relativePath);
  fs.mkdirSync(path.dirname(fullPath), { recursive: true });
  fs.writeFileSync(fullPath, content);
}

console.log("Created TRS mock files");
