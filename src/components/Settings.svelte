<script lang="ts">
  import GLOBAL_CONFIG from "../cli_app/Config/config";

  const data = GLOBAL_CONFIG.prettify();
</script>

<div class="container">
  <div class="table-wrapper">
    <strong>Data Cache</strong>
    <table>
      <tr><td>Num Sets:</td><td>{data.Data_Cache.Sets}</td></tr>
      <tr><td>Set Size:</td><td>{data.Data_Cache.Set_Size}</td></tr>
      <tr><td>Line Size:</td><td>{data.Data_Cache.Line_Size}</td></tr>
      <tr><td>Policy</td><td>{data.Data_Cache.Policy}</td></tr>
      <tr><td>Algorithm:</td><td>{data.Data_Cache.Alg}</td></tr>
    </table>
  </div>
  <div class="table-wrapper">
    <strong>Page Table</strong>
    <table>
      <tr><td>Virtual Pages</td><td>{data.Page_Table.Virtual}</td></tr>
      <tr><td>Physical Pages</td><td>{data.Page_Table.Physical}</td></tr>
      <tr><td>Page Size</td><td>{data.Page_Table.Page_Size}</td></tr>
      <tr><td>Algorithm</td><td>{data.Page_Table.Alg}</td></tr>
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
