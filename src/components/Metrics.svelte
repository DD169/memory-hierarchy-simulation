<script lang="ts">
  import { GLOBAL_LOGGER } from "../cli_app/Logger";

  const data = GLOBAL_LOGGER.metrics;
</script>

<div class="container">
  <div class="table-wrapper">
    <strong>Data Cache</strong>
    <table>
      <tr><td>Num Hits:</td><td>{data.numDataCacheHits}</td></tr>
      <tr><td>Num Compulsory:</td><td>{data.numDataCacheCmp}</td></tr>
      <tr><td>Num Capacity:</td><td>{data.numDataCacheCap}</td></tr>
      <tr>
        <td>Ratio:</td><td>
          {Math.round((data.numDataCacheHits / (data.numDataCacheCmp + data.numDataCacheCap)) * 1000) / 1000}
        </td>
      </tr>
    </table>
  </div>
  <div class="table-wrapper">
    <strong>Page Table</strong>
    <table>
      <tr><td>Num Hits:</td><td>{data.numPageTableHits}</td></tr>
      <tr><td>Num Compulsory:</td><td>{data.numPageTableCmp}</td></tr>
      <tr><td>Num Capacity:</td><td>{data.numPageTableCap}</td></tr>
      <tr
        ><td>Ratio:</td>
        <td>
          {Math.round((data.numPageTableHits / (data.numPageTableCmp + data.numPageTableCap)) * 1000) / 1000}
        </td>
      </tr>
    </table>
  </div>
</div>

<style>
  .container {
    font-size: 1.8rem;
    background-color: var(--clr-base-750);
    padding: 1em;
    border-radius: 2rem;
    width: 100%;
    height: 100%;
    overflow: scroll;
    display: flex;
    flex-direction: column;
    gap: 2rem;
  }

  .table-wrapper {
    margin-left: 5rem;
  }

  strong {
    font-size: 1.5em;
    font-weight: bold;
  }

  table {
    padding-left: 2em;
  }

  td:first-child {
    min-width: 20ch;
  }
</style>
