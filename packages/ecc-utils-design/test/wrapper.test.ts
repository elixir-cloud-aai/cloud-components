// import { fixture, expect } from '@open-wc/testing';
// import { wrapper } from '../src/components/index.js';
// import { Wrapper } from '../src/components/wrapper/wrapper.js';

// describe('rendering', async () => {
//   let wrapperTag: string;
//   let wrapperEl: Wrapper;

//   beforeEach(async () => {
//     // given
//     wrapperTag = `<${wrapper} debug ></${wrapper}>`;
//     wrapperEl = await fixture<Wrapper>(wrapperTag);
//   });

//   it('renders with empty config by default', async () => {
//     expect(wrapperEl.config).to.equal('');
//   });
// });

// describe('processing tokens', () => {
//   let wrapperTag: string;
//   let wrapperEl: Wrapper;

//   beforeEach(async () => {
//     // given
//     wrapperTag = `<${wrapper} debug ></${wrapper}>`;
//     wrapperEl = await fixture<Wrapper>(wrapperTag);
//   });

//   const simpleTokens = [
//     '{"text-color": "blue", "background-color": "red"}',
//     '{"text-color": "yellow", "background-color": "pink"}',
//   ];

//   simpleTokens.forEach((value, index) => {
//     it('should parse simple tokens correctly', async () => {
//       // when
//       wrapperEl.config = value;
//       wrapperEl.connectedCallback();

//       const textColor = wrapperEl.locallyStoredTokens['default-text-color'];
//       const backgroundColor =
//         wrapperEl.locallyStoredTokens['default-background-color'];

//       // then
//       switch (index) {
//         case 0:
//           expect(textColor).to.be.equal('blue');
//           expect(backgroundColor).to.be.equal('red');
//           break;

//         case 1:
//           expect(textColor).to.be.equal('yellow');
//           expect(backgroundColor).to.be.equal('pink');
//           break;

//         default:
//           break;
//       }
//     });
//   });

//   const complexTokens = [
//     {
//       'text-color': 'red',
//       'background-color': 'yellow',
//       secondary: {
//         'text-color': 'white',
//         'background-color': 'green',
//       },
//       default: {
//         'text-color': 'pink',
//       },
//       primary: {
//         'text-color': 'red',
//         ' background-color': 'green',
//       },
//     },

//     `{
//       "primary": {
//         "text-color": "red",
//         "background-color": "pink"
//       },
//       "text-color": "blue",
//       "background-color": "pink",
//         "secondary": {
//           "text-color": "white",
//           "background-color": "red"
//         }
//       }`,
//   ];

//   complexTokens.forEach((value, index) => {
//     it('should parse complex tokens correctly', () => {
//       // when
//       wrapperEl.config = value;
//       wrapperEl.connectedCallback();

//       const defaultTextColor =
//         wrapperEl.locallyStoredTokens['default-text-color'];
//       const defaultBackgroundColor =
//         wrapperEl.locallyStoredTokens['default-background-color'];

//       const primaryTextColor =
//         wrapperEl.locallyStoredTokens['primary-text-color'];
//       const primaryBackgroundColor =
//         wrapperEl.locallyStoredTokens['primary-background-color'];

//       const secondaryTextColor =
//         wrapperEl.locallyStoredTokens['secondary-text-color'];
//       const secondaryBackgroundColor =
//         wrapperEl.locallyStoredTokens['secondary-background-color'];

//       switch (index) {
//         case 0:
//           expect(defaultTextColor).to.be.equal('pink');
//           expect(defaultBackgroundColor).to.be.equal('yellow');
//           expect(secondaryTextColor).to.be.equal('white');
//           expect(secondaryBackgroundColor).to.be.equal('green');
//           expect(primaryTextColor).to.be.equal('red');
//           break;
//         case 1:
//           expect(defaultTextColor).to.be.equal('blue');
//           expect(defaultBackgroundColor).to.be.equal('pink');
//           expect(secondaryBackgroundColor).to.be.equal('red');
//           expect(primaryBackgroundColor).to.be.equal('pink');
//           expect(secondaryTextColor).to.be.equal('white');
//           break;

//         default:
//           break;
//       }
//     });
//   });
// });
