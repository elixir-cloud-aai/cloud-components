import { fixture } from "@open-wc/testing";
import { wrapper, button } from "../src/components/index.js";
import { Wrapper } from "../src/components/wrapper/wrapper.js";

// describe('rendering', async () => {});

describe("processing tokens", () => {
  let wrapperTag: string;
  let wrapperEl: Wrapper;

  beforeEach(async () => {
    // given
    wrapperTag = `<${wrapper} debug ><${button}></${button}> </${wrapper}>`;
    wrapperEl = await fixture<Wrapper>(wrapperTag);
  });

  it("should paarse simple tokens correctly", () => {
    console.log(wrapperEl);
  });
});
