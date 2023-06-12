import { html } from "@microsoft/fast-element";

const template = html`
<div class="search">
    <input type="text" value="${x => x.searchQuery}" @input="${x => x.handleSearch(event)}">
    <span class="filter-icon" @click="${x => x.filterToggle()}">Filter</span>
    <div class="filter-card ${x => x.filterActive ? 'active' : ''}">
      <input type="text" placeholder="Filter 1">
      <input type="text" placeholder="Filter 2">
    </div>
  </div>
`;

export default template;
