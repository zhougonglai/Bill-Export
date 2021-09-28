<script>
  import 'carbon-components-svelte/css/white.css';
  import {
    SkipToContent,
    Content,
    ComposedModal,
    ModalHeader,
    ModalBody,
    FluidForm,
    TextInput,
    ModalFooter,
    Header,
    HeaderUtilities,
    HeaderGlobalAction
  } from 'carbon-components-svelte';
  import { onMount } from 'svelte';
  import { get } from 'svelte/store';
  import { session } from '$app/stores';
  import UserFilled20 from 'carbon-icons-svelte/lib/UserFilled20';
  let loaded = false;
  let open = false;
  let generater = {
    grant_type: 'client_credentials',
    client_id: '',
    client_secret: ''
  };

  $: sessionStore = get(session);

  onMount(() => {
    loaded = true;
    if ('account_token' in sessionStore) {
      open = false;
    } else {
      open = true;
    }
  });

  const toggleModal = (bool) => (open = bool);
  const oauthToken = async () => {
    window.open(
      `https://aip.baidubce.com/oauth/2.0/token?${new URLSearchParams(
        generater
      )}`
    );
  };
</script>

{#if loaded}
  <ComposedModal preventCloseOnClickOutside bind:open on:submit={oauthToken}>
    <ModalHeader title="生成Token" />
    <ModalBody hasForm>
      <FluidForm>
        <TextInput
          labelText="API Key"
          placeholder="请填写"
          required
          bind:value={generater.client_id}
        />
        <TextInput
          labelText="Secret Key"
          placeholder="请填写"
          required
          bind:value={generater.client_secret}
        />
      </FluidForm>
    </ModalBody>
    <ModalFooter primaryButtonText="生成" />
  </ComposedModal>

  <Header company="雷神科技" platformName="增值税票据识别">
    <div slot="skip-to-content">
      <SkipToContent />
    </div>
    <HeaderUtilities>
      <HeaderGlobalAction
        aria-label="login"
        icon={UserFilled20}
        on:click={() => toggleModal(true)}
      />
    </HeaderUtilities>
  </Header>

  <Content>
    <slot />
  </Content>
{/if}
