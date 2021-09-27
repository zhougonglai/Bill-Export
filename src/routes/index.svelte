<script>
  import 'carbon-components-svelte/css/white.css';
  import { getStores, page, session } from '$app/stores';
  import { get } from 'svelte/store';
  import {
    ComposedModal,
    ModalHeader,
    ModalBody,
    ModalFooter,
    Checkbox
  } from 'carbon-components-svelte';
  import { onMount } from 'svelte';
  import { subscribe } from 'svelte/internal';

  $: route = get(page);
  $: store = getStores();
  onMount(() => {
    console.log(store);
  });
</script>

<main>
  <header>header</header>
  <section>
    {#await get(store.page) then value}
      {JSON.stringify(value)}
    {/await}
  </section>
</main>

<style lang="scss">
  main {
    min-width: 100vw;
    min-height: 100vh;
    overflow-y: auto;
    overflow-x: hidden;
  }
</style>
