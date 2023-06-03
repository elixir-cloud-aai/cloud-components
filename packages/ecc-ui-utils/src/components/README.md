# Creating Components

This project follows a structure where each web component resides in its own separate folder. The folder contains the following files:
- `/fixtures`: This directory contains the `base.html` which has example html code for calling the component.
- `definition.ts`: Defines the custom element and registers it with the browser.
- `template.ts`: Contains the HTML template for the component.
- `styles.ts`: Contains the CSS styles specific to the component.
- `stories.ts`: Contains component stories or examples for documentation and testing purposes.
- `spec.ts`: Contains test for the component
- Other required files specific to the component.

## Folder Structure

```
src
└── components
    └── component-name
        ├── fixtures
        │   └── base.html
        ├── definition.ts
        ├── template.ts
        ├── styles.ts
        ├── stories.ts
        └── other required files

```

## Getting Started

To create a new web component, follow these steps:

1. Create a new folder inside the `src/components` directory with the name of your component (e.g., `ComponentName`).
> Note: The components name will automatically be prefixed with `ecc`, and rest of the name needs to be in kebab-case.
2. Inside the component folder, create the required files (`definition.ts`, `template.ts`, `styles.ts`, `comp.ts`, `stories.ts`, and any other necessary files).
3. Implement the component's functionality, template, styles, and stories according to your project's requirements.

Feel free to explore the existing components in the `src/components` directory for reference.

