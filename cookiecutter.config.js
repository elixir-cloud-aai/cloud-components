module.exports = [
  {
    name: "WEB COMPONENT PACKAGE",
    templatePath: "templates/PACKAGE_NAME",
    outputPath: "packages/",
    fields: [
      {
        templateVariable: "PACKAGE_NAME",
        question: "What is the package's name? \n Package names MUST contain the following particles (particles in parentheses MAY be included, parts in angular brackets MUST be included only if applicable):\n library-domain(-subdomains)[-organization][-product] \n",
        errorMessage:
          "Package name must be in kebab-case and be lower case. Example: ecc-client-ga4gh-service-registry",
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
