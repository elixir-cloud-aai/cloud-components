import { html, TemplateResult } from "lit";
import "../src/ecc-utils-design.js";

export default {
  title: "EccUtilsDesign",
  component: "ecc-utils-design",
  argTypes: {
    header: { control: "text" },
    counter: { control: "number" },
    textColor: { control: "color" },
  },
};

interface Story<T> {
  (args: T): TemplateResult;
  args?: Partial<T>;
  argTypes?: Record<string, unknown>;
}

interface ArgTypes {
  header?: string;
  counter?: number;
  textColor?: string;
  slot?: TemplateResult;
}

const Template: Story<ArgTypes> = ({
  header = "Hello world",
  counter = 5,
  textColor,
  slot,
}: ArgTypes) => html`
  <ecc-utils-design
    style="--ecc-utils-design-text-color: ${textColor || "black"}"
    .header=${header}
    .counter=${counter}
  >
    ${slot}
  </ecc-utils-design>
`;

export const Regular = Template.bind({});

export const CustomHeader = Template.bind({});
CustomHeader.args = {
  header: "My header",
};

export const CustomCounter = Template.bind({});
CustomCounter.args = {
  counter: 123456,
};

export const SlottedContent = Template.bind({});
SlottedContent.args = {
  slot: html`<p>Slotted content</p>`,
};
SlottedContent.argTypes = {
  slot: { table: { disable: true } },
};
