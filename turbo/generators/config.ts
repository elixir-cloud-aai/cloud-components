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
  plop.setGenerator('packages', {
    description: 'Generate a base config for new package',
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
        choices: ['client', 'dashboard', { name: 'Fill custom input for this field', value: '__custom__' }],
      },
      {
        // If custom input selected for subdomain take the input
        type: 'input',
        name: 'customLibraryDomain',
        message: 'Enter custom library domain:',
        when: (data) => data.libraryDomain === '__custom__',
        validate: validateNotEmpty,
      },
      {
        type: 'input',
        name: 'librarySubDomain',
        message: 'Enter library Subdomain (to skip press ENTER) :',
      },
      {
        type: 'input',
        name: 'organisation',
        message: 'Enter organization name if applicable (to skip press ENTER) :',
      },
      {
        type: 'input',
        name: 'product',
        message: 'Enter product name (cannot be left blank) :',
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
      if (data) {
        // Take the prompt value and convert it into kebab-case
        const library = data.library || '';
        const libraryDomain = data.libraryDomain === '__custom__' ? data.customLibraryDomain : data.libraryDomain;
        const librarySubDomain = data.librarySubDomain || '';
        const organisation = data.organisation || '';
        const product = data.product || '';

        const name = [library, libraryDomain, librarySubDomain, organisation, product].filter(Boolean).join('-');
        const kebabName = kebabCase(name);

        if (kebabName.length > 128) {
          return [
            {
              type: 'run',
              // Empty template to not generate any file
              template: '',
              // Error message
              message: 'Package name is too long, please shorten it. (Package name cannot be greater than 128 characters)',
            },
          ];
        }
        // Add a new field "name" to inquirer.Answers
        data.name = kebabName;
        return [
          {
            type: 'addMany',
            destination: '{{ turbo.paths.root }}/packages/{{ name }}',
            templateFiles: 'templates/**/*.hbs',
            stripExtensions: ['hbs'],
            abortOnFail: true,
          },
          {
            type: 'add',
            path: '{{ turbo.paths.root }}/packages/{{ name }}/.eslintrc',
            templateFile: 'templates/.eslintrc.hbs',
          },
          {
            type: 'add',
            path: '{{ turbo.paths.root }}/packages/{{ name }}/.eslintignore',
            templateFile: 'templates/.eslintignore.hbs',
          },
          {
            type: 'add',
            path: '{{ turbo.paths.root }}/packages/{{ name }}/.gitignore',
            templateFile: 'templates/.gitignore.hbs',
          },
        ];
      }
      return [
        {
          type: 'run',
          template: '',
          // Error message
          message: 'Please try again, some internal error occured',
        },
      ];
    },
  });
}
