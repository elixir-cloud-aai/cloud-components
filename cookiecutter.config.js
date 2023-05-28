module.exports = [
  {
    name: "WEB COMPONENT PACKAGE",
    templatePath: "templates/PACKAGE_NAME",
    outputPath: "packages/",
    fields: [
      {
        templateVariable: "PACKAGE_NAME",
        question: "What is the package's name?",
        errorMessage:
          "Package name must be in snake_case and be lower case. Example: my_package",
        isValid: function (value) {
          return !!value.match(/^[a-z0-9]+(-[a-z0-9]+)*$/);
        },
      },
      {
        templateVariable: "PACKAGE_DESCRIPTION",
        question: "What is the package's description?",
      },
      // {
      //   templateVariable: "PACKAGE_TYPE",
      //   question: "What is the package's type?",
      //   choices: ["Web-Component", "Other"],
      // },
    ],
  },
];
