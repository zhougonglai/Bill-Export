<script>
  import {
    ComposedModal,
    FluidForm,
    ModalBody,
    ModalFooter,
    ModalHeader,
    TextInput
  } from 'carbon-components-svelte';
  import Cookies from 'js-cookie';
  import { session } from '$app/stores';

  export let form;
  export let open = false;
  export let generater = {
    grant_type: 'client_credentials',
    client_id: '',
    client_secret: ''
  };

  function clearForm() {
    console.log('clearForm');
    // form.$$restProps();
  }

  async function oauthToken() {
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
      open = false;
    }
  }
</script>

<ComposedModal bind:open on:submit={oauthToken}>
  <ModalHeader title="获取Token" />
  <ModalBody hasForm>
    <FluidForm bind:this={form}>
      <TextInput
        required
        labelText="API Key"
        bind:value={generater.client_id}
      />
      <TextInput
        required
        labelText="Secret Key"
        bind:value={generater.client_secret}
      />
    </FluidForm>
  </ModalBody>
  <ModalFooter primaryButtonText="确认" />
</ComposedModal>
