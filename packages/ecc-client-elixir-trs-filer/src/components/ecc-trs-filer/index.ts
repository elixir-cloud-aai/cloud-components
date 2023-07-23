import { TRSToolsList } from "./custom/trs-list/trs-list.js";
import { CopyClipboard } from "./custom/copy/copy.js";
import { CustomTooltip } from "./custom/tooltip/tooltip.js";
import { CustomSearch } from "./custom/search/search.js";
import { TRS } from "./definition/ecc-trs-filer.js";
import { TRSClasses } from "./custom/trs-classes/trs-classes.js";

const components = [
  TRSToolsList,
  TRSClasses,
  CopyClipboard,
  CustomTooltip,
  CustomSearch,
  TRS,
];

export default components;
