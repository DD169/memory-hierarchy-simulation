<script lang="ts">
  import { GLOBAL_LOGGER } from "../cli_app/Logger";

  const outputStrings = GLOBAL_LOGGER.toStringArray();

  const outputHeaders = [
    "Address",
    "Virt Page #",
    "Page Offset",
    "PT Result",
    "Phys Page #",
    "DC Tag",
    "DC Set Index",
    "DC Line Index",
    "DC Result",
  ];
</script>

<div class="container">
  <div class="table-wrapper">
    <table>
      <thead>
        <tr>
          {#each outputHeaders as columnHeader}
            <th>
              {columnHeader}
            </th>
          {/each}
        </tr>
      </thead>
      <tbody>
        {#each outputStrings as line}
          <tr>
            {#each line as data}
              <td>
                {data}
              </td>
            {/each}
          </tr>
        {/each}
      </tbody>
    </table>
  </div>
</div>

<style>
  .container {
    width: 100%;
    height: 100%;

    font-size: 1.5rem;
    position: relative;
    overflow: scroll;
    border-radius: 2rem;
    background-color: var(--clr-base-750);
  }

  .table-wrapper {
    width: 100%;
    height: 100%;
  }

  table {
    width: 100%;
    left: 0;
    top: 0;
    position: absolute;
    text-align: center;
    border: none;
    border-collapse: collapse;
  }

  tr:hover {
    background-color: var(--clr-base-700);
  }

  th {
    top: 0;
    position: sticky;
    font-size: 1.2em;
    background-color: var(--clr-base-750);
    padding-block: 0.5em;
  }

  th,
  td {
    padding-inline: 1em;
  }
</style>
