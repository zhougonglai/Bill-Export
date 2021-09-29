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
    ButtonSet
  } from 'carbon-components-svelte';
  import { onMount } from 'svelte';
  import { get } from 'svelte/store';
  import { session } from '$app/stores';
  import UserFilled20 from 'carbon-icons-svelte/lib/UserFilled20';
  let loaded = false;
  let currentIndex = 0;
  let token = '';
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

  $: sessionStore = get(session);

  onMount(() => {
    loaded = true;
    if ('account_token' in sessionStore) {
      open = false;
    } else {
      open = true;
    }
  });

  const stepContrl = (index) => (currentIndex = index);

  async function oauthToken() {
    if (generater.client_id && generater.client_secret) {
      const params = new URLSearchParams(generater);
      window.open(
        `https://aip.baidubce.com/oauth/2.0/token?${params.toString()}`
      );
      stepContrl(1);
    }
  }
</script>

{#if loaded}
  <Header company="雷神科技" platformName="增值税票据识别">
    <div slot="skip-to-content">
      <SkipToContent />
    </div>
    <HeaderUtilities>
      <HeaderGlobalAction aria-label="login" icon={UserFilled20} />
    </HeaderUtilities>
  </Header>

  <Content>
    <ProgressIndicator bind:currentIndex spaceEqually class="w-full">
      {#each steps as step, i}
        <ProgressStep
          complete={currentIndex >= i}
          label={step.label}
          on:click={() => (currentIndex = i)}
        />
      {/each}
    </ProgressIndicator>
    {#if currentIndex === 0}
      <FluidForm class="mt-8">
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
        <ButtonSet class="justify-end mt-4">
          <Button kind="secondary" on:click={() => stepContrl(currentIndex + 1)}
            >下一步</Button
          >
          <Button on:click={() => oauthToken()}>生成Token</Button>
        </ButtonSet>
      </FluidForm>
    {:else}
      <FluidForm class="mt-8">
        <TextInput
          labelText="API Key"
          placeholder="请填写"
          required
          bind:value={token}
        />
        <ButtonSet class="justify-end mt-4">
          <Button kind="secondary" on:click={() => stepContrl(currentIndex - 1)}
            >上一步</Button
          >
          <Button>使用Token</Button>
        </ButtonSet>
      </FluidForm>
    {/if}
    <slot />
  </Content>
{/if}
