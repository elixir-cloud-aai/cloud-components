"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var config = {
    projects: [
        {
            name: "Desktop Chromium",
            use: {
                browserName: "chromium",
            },
        },
    ],
    webServer: {
        command: "npm run serve",
        port: 3000,
        reuseExistingServer: !process.env.CI,
    },
};
exports.default = config;
