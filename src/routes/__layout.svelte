<script>
  import '../app.css';
  import 'carbon-components-svelte/css/white.css';
  import {
    SkipToContent,
    Content,
    FluidForm,
    TextInput,
    Header,
    HeaderUtilities,
    HeaderGlobalAction,
    ProgressIndicator,
    ProgressStep,
    Button,
    ButtonSet,
    Loading,
    Modal
  } from 'carbon-components-svelte';
  import { onMount } from 'svelte';
  import UserFilled20 from 'carbon-icons-svelte/lib/UserFilled20';
  import { get } from 'svelte/store';
  import Cookies from 'js-cookie';
  import { session } from '$app/stores';

  import LoginModal from '$lib/LoginModal.svelte';

  let loaded = false;
  let open = false;

  $: session_store = get(session);

  // let access_token = Cookies.get('access_token');

  session.subscribe((store) => store);

  onMount(() => {
    loaded = true;
    console.log('access_token', session_store);
    if (Cookies.get('access_token')) {
      session.set({ access_token: Cookies.get('access_token') });
      console.log(session_store);
    } else {
      open = true;
    }
  });
</script>

{#if loaded}
  <Header company="雷神科技" platformName="增值税票据识别">
    <div slot="skip-to-content">
      <SkipToContent />
    </div>
    <HeaderUtilities>
      <HeaderGlobalAction
        class="icon"
        aria-label="login"
        icon={UserFilled20}
        on:click={() => (open = true)}
      />
    </HeaderUtilities>
  </Header>

  <Content>
    {#if session_store.access_token}
      <Modal
        bind:open
        modalHeading="Token"
        primaryButtonText="确认"
        secondaryButtonText="清理Token"
        on:click:button--secondary={() => {
          session.set('');
          Cookies.remove('access_token');
          open = false;
          location.reload();
        }}
        on:open
        on:close
        on:submit={() => (open = false)}
      >
        <p>{session_store.access_token}</p>
      </Modal>
    {:else}
      <LoginModal bind:open />
    {/if}
    <slot />
  </Content>
{:else}
  <Loading />
{/if}

<style lang="scss">
  :global(.bx--header__action > svg) {
    display: initial;
  }
</style>
