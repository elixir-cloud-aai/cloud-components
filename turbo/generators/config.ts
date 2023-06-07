import { PlopTypes } from '@turbo/gen';

// Convert a string to kebab-case
function kebabCase(str) {
  return str
    // Replace lowercase letter followed by an uppercase letter with a hyphen in between
    .replace(/([a-z])([A-Z])/g, '$1-$2')
    // Replace whitespace and underscores with hyphens
    .replace(/[\s_]+/g, '-')
    // Convert the string to lowercase
    .toLowerCase();
}

function validateNotEmpty(input:string) {
  if (!input.length) {
    return 'This field cannot be left empty!';
  }
  return true;
}

export default function generator(plop: PlopTypes.NodePlopAPI): void {
  /**
   * custom action to log error when the package name length is long.
   * 'error': Name of the action
   */
  plop.setActionType('error', (config) => {
    const { name } = (config as { name: string });
    return Promise.reject(Error(`${name} is too long for the package, please shorten it to 128 character or below.`));
  });

  plop.setGenerator('package', {
    description: 'Generate a new package in the packages directory',
    prompts: [
      {
        type: 'list',
        name: 'library',
        message: 'Select a library the package will belong to:',
        choices: ['ecc'],
      },
      {
        type: 'list',
        name: 'libraryDomain',
        message: 'Select domain of the package:',
        choices: ['client', 'utils'],
      },
      {
        type: 'input',
        name: 'librarySubDomain',
        message: 'Enter library Subdomain (to skip press ENTER):',
      },
      {
        type: 'input',
        name: 'organisation',
        message: 'Enter organization name if applicable (to skip press ENTER):',
      },
      {
        type: 'input',
        name: 'product',
        message: 'Enter product name:',
        validate: validateNotEmpty,
      },
      {
        type: 'input',
        name: 'description',
        message: 'Write a description for the package',
        validate: validateNotEmpty,
      },
    ],
    actions: (data: any) => {
      // Take the prompt value and convert it into kebab-case
      const library = data.library || '';
      const libraryDomain = data.libraryDomain || '';
      const librarySubDomain = data.librarySubDomain || '';
      const organisation = data.organisation || '';
      const product = data.product || '';

      const names = [library, libraryDomain, librarySubDomain, organisation, product].filter(Boolean).join('-');
      const kebabName = kebabCase(names);

      // Add a new field "name" to inquirer.Answers
      data.name = kebabName as string;

      // If the name length is out of bound, log error.
      if (kebabName.length > 128) {
        return [
          {
            type: 'error',
            name: kebabName,
          },
        ];
      }

      // all the actions to create the template
      const actions = [
        {
          type: 'addMany',
          destination: '{{ turbo.paths.root }}/packages/{{ name }}',
          templateFiles: 'template-package/**/*.hbs',
          stripExtensions: ['hbs'],
          abortOnFail: true,
        },
        {
          type: 'add',
          path: '{{ turbo.paths.root }}/packages/{{ name }}/.eslintrc',
          templateFile: 'template-package/.eslintrc.hbs',
        },
        {
          type: 'add',
          path: '{{ turbo.paths.root }}/packages/{{ name }}/.eslintignore',
          templateFile: 'template-package/.eslintignore.hbs',
        },
        {
          type: 'add',
          path: '{{ turbo.paths.root }}/packages/{{ name }}/.gitignore',
          templateFile: 'template-package/.gitignore.hbs',
        },
      ];

      // else create the template
      return actions;
    },
  });
}
