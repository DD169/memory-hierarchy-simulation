<script lang="ts">
  import { cli_app } from "./cli_app/cli_app";
  import Metrics from "./components/Metrics.svelte";
  import Results from "./components/Results.svelte";
  import Settings from "./components/Settings.svelte";

  cli_app.run();
</script>

<div class="container">
  <div class="left">
    <div class="left-child-wrapper">
      <Settings />
    </div>
    <div class="left-child-wrapper">
      <Metrics />
    </div>
  </div>
  <div class="right">
    <div class="results-wrapper">
      <Results />
    </div>
  </div>
</div>

<style>
  .container {
    width: 100%;
    height: 100%;
    display: grid;
    place-items: center;

    font-size: 5rem;
    background-color: var(--clr-base-900);

    display: flex;
    justify-content: space-around;
    gap: 5rem;
    padding: 5rem;
  }

  .left {
    display: flex;
    gap: 3rem;
    flex-direction: column;
    width: 60%;
    height: 100%;
  }

  .right {
    height: 100%;
    width: 100%;
  }

  .results-wrapper {
    width: 100%;
    height: 100%;
  }

  .left-child-wrapper {
    width: 100%;
    height: 50%;
  }
</style>
