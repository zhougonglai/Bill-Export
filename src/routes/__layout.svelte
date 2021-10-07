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
    Loading
  } from 'carbon-components-svelte';
  import { onMount } from 'svelte';
  import UserFilled20 from 'carbon-icons-svelte/lib/UserFilled20';
  import { get } from 'svelte/store';
  import Cookies from 'js-cookie';
  import { session } from '$app/stores';

  import Modal from '$lib/Modal.svelte';

  let loaded = false;
  let open = false;
  let generater = {
    grant_type: 'client_credentials',
    client_id: '',
    client_secret: ''
  };
  let steps = [
    {
      label: '生成Token'
    },
    {
      label: '填写Token'
    }
  ];

  $: access_token = Cookies.get('access_token');
  $: linkToken = new URLSearchParams(generater);

  session.subscribe((store) => store);

  onMount(() => {
    loaded = true;
    console.log('access_token', access_token);
    if (access_token) {
      session.set({ access_token });
    }
  });

  const stepContrl = (index) => (currentIndex = index);

  async function oauthToken(e) {
    if (generater.client_id && generater.client_secret) {
      // const params = new URLSearchParams(generater);
      const { access_token, expires_in } = await fetch('/api/token', {
        method: 'post',
        body: JSON.stringify(generater)
      }).then((res) => res.json());
      Cookies.set('access_token', access_token, {
        expires: expires_in / 60 / 60 / 24
      });
      session.set({ access_token });
    }
  }
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
    <Modal bind:open />
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
