import { PlopTypes } from '@turbo/gen';

export default function generator(plop: PlopTypes.NodePlopAPI): void {
  plop.setGenerator('packages', {
    description: 'Generate a base config for new package',
    prompts: [
      {
        type: 'input',
        name: 'name',
        message:
        'What is the name of the package?',
        validate: (input) => {
          if (!input.match(/^[a-z0-9]+(-[a-z0-9]+)*$/)) {
            return 'Name must be in kebab-case and in lower case letters. Example: my-package';
          }
          return true;
        },
      },
      {
        type: 'input',
        name: 'description',
        message: 'Write a description for the package',
      },
    ],
    actions: [
      {
        type: 'add',
        path: '{{ turbo.paths.root }}/packages/{{name}}/images/logo-elixir-cloud-aai.svg',
        templateFile: 'templates/images-template/logo-elixir-cloud-aai.svg.hbs',
      },
      {
        type: 'add',
        path: '{{ turbo.paths.root }}/packages/{{name}}/images/logo-elixir.svg',
        templateFile: 'templates/images-template/logo-elixir.svg.hbs',
      },
      {
        type: 'add',
        path: '{{ turbo.paths.root }}/packages/{{name}}/package.json',
        templateFile: 'templates/package.json.hbs',
      },
      {
        type: 'add',
        path: '{{ turbo.paths.root }}/packages/{{name}}/package-lock.json',
        templateFile: 'templates/package-lock.json.hbs',
      },
      {
        type: 'add',
        path: '{{ turbo.paths.root }}/packages/{{name}}/.eslintrc',
        templateFile: 'templates/eslintrc.hbs',
      },
      {
        type: 'add',
        path: '{{ turbo.paths.root }}/packages/{{name}}/.eslintignore',
        templateFile: 'templates//eslintignore.hbs',
      },
      {
        type: 'add',
        path: '{{ turbo.paths.root }}/packages/{{name}}/.gitignore',
        templateFile: 'templates/gitignore.hbs',
      },
      {
        type: 'add',
        path: '{{ turbo.paths.root }}/packages/{{name}}/readme.md',
        templateFile: 'templates/readme.md.hbs',
      },
    ],
  });
}
