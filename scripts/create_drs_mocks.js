const fs = require("fs");
const path = require("path");

const mockDir = path.join(__dirname, "..", "mocks", "ga4gh-drs");

const files = {
  "objects/get.json":
    '{\n  "objects": [\n    {\n      "id": "mock-drs-001",\n      "name": "Mock DRS Object 1",\n      "size": 1024,\n      "created_time": "2023-01-01T00:00:00Z",\n      "updated_time": "2023-01-01T00:00:00Z",\n      "version": "1.0",\n      "mime_type": "text/plain",\n      "checksums": [\n        {\n          "type": "md5",\n          "checksum": "d41d8cd98f00b204e9800998ecf8427e"\n        }\n      ]\n    }\n  ],\n  "pagination": {\n    "offset": 0,\n    "limit": 10,\n    "total": 1\n  }\n}',
  "objects/id.json":
    '{\n  "id": "mock-drs-001",\n  "name": "Mock DRS Object 1",\n  "size": 1024,\n  "created_time": "2023-01-01T00:00:00Z",\n  "updated_time": "2023-01-01T00:00:00Z",\n  "version": "1.0",\n  "mime_type": "text/plain",\n  "checksums": [\n    {\n      "type": "md5",\n      "checksum": "d41d8cd98f00b204e9800998ecf8427e"\n    }\n  ],\n  "access_methods": [\n    {\n      "access_id": "access-001",\n      "type": "s3",\n      "region": "us-east-1"\n    }\n  ]\n}',
  "objects/access.json":
    '{\n  "url": "https://example.com/mock-drs-file.txt",\n  "headers": []\n}',
  "service-info.json":
    '{\n  "id": "mock-ga4gh-drs-service",\n  "name": "Mock GA4GH DRS Service",\n  "type": {\n    "group": "org.ga4gh",\n    "artifact": "drs",\n    "version": "1.1.0"\n  },\n  "organization": {\n    "name": "Mock Org",\n    "url": "https://example.com"\n  },\n  "version": "1.1.0"\n}',
};

for (const [relativePath, content] of Object.entries(files)) {
  const fullPath = path.join(mockDir, relativePath);
  fs.mkdirSync(path.dirname(fullPath), { recursive: true });
  fs.writeFileSync(fullPath, content);
}

console.log("Created GA4GH DRS mock files");
