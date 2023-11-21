import { css } from "lit";

const styles = css`
  :host {
    display: block;
  }
  .collection {
    position: relative;
  }
  .title {
    width: 100%;
    display: flex;
    justify-content: space-between;
    margin-right: 1rem;
    align-items: center;
  }
  .filters {
    display: flex;
    justify-content: flex-end;
    gap: 1rem;
  }
  .header {
    margin-bottom: 1rem;
  }
  .footer {
    margin-top: 1rem;
    display: flex;
    justify-content: center;
  }
  .skeleton-title {
    width: 30%;
    height: 1.5rem;
  }
  .skeleton-body {
    width: 100%;
    height: 1rem;
  }
  .lazy {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
  }
  .badge {
    height: 1.5rem;
  }
  .hidden {
    visibility: hidden;
  }
  .error {
    width: 100%;
    position: absolute;
    top: 1rem;
    display: flex;
    justify-content: center;
  }
`;

export default styles;
