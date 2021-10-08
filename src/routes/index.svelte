<script>
  import {
    Button,
    ButtonSet,
    DataTable,
    FileUploader,
    FileUploaderButton,
    FileUploaderDropContainer,
    FileUploaderItem,
    Tab,
    TabContent,
    Tabs,
    Tile
  } from 'carbon-components-svelte';
  import DirectionStraightRight20 from 'carbon-icons-svelte/lib/DirectionStraightRight20';
  import { get } from 'svelte/store';
  import XLSX from 'xlsx';
  import { fileByBase64 } from '$lib/utils';
  import { orcInvoice } from '$lib/services';

  let fileInputEl,
    selected = 0,
    files = [],
    tables = [];

  const checkSize = (file) => file.size > 4 * 1024 * 1024;

  const checkImg = (img) =>
    img.naturalHeight < 15 ||
    img.naturalHeight > 4096 ||
    img.naturalWidth < 15 ||
    img.naturalWidth > 4096;

  const validFile = (file, cb) => {
    const img = new Image();
    img.src = window.URL.createObjectURL(file);
    img.onload = (e) => {
      const invalid = checkImg(img) || checkSize(file);
      fileByBase64(file, (result) => {
        cb({
          file,
          invalid,
          status: 'edit',
          size: {
            with: img.naturalWidth,
            height: img.naturalHeight
          },
          result,
          errorSubject: checkSize(file)
            ? '文件过大'
            : checkImg(img)
            ? '尺寸错误'
            : '',
          errorBody: invalid ? '文件错误' : ''
        });
      });
    };
  };

  const fileUpload = ({ detail }) => {
    let i = 0;
    while (i < detail.length) {
      validFile(detail[i], (file) => {
        files = [...files, file];
      });
      i++;
    }
  };

  const deleteFile = (i) => {
    files.splice(i, 1);
    files = files;
  };

  const ocrInvoiceAct = () => {
    const action = (params) => [{ image: params }];
    files = files.map((file) =>
      file.status === 'edit' ? { ...file, status: 'uploading' } : file
    );
    const orcFiles = files.filter((file) => file.status === 'uploading');
    Promise.all(
      orcFiles.map((file) =>
        orcInvoice(action(file.result)[selected]).then((res) => res.json())
      )
    )
      .then((res) => {
        console.log(res);
        tables = tables.concat(res);
        console.log(tables);
        files = files.map((file) => ({ ...file, status: 'complete' }));
      })
      .catch((err) => {
        files = files.map((file) => ({ ...file, status: 'edit' }));
      });
  };

  const exportExcel = () => {
    const book = XLSX.utils.table_to_book(
      document.getElementsByTagName('table')[0]
    );
    XLSX.writeFile(book, '票据.xlsx');
  };
</script>

<Tabs bind:selected>
  <Tab label="本地图片" />
  <Tab label="网络图片" />
  <Tab label="PDF" />
  <div slot="content">
    <TabContent class="grid grid-cols-2 gap-4">
      {#if selected === 0}
        <div>
          <Tile
            >支持jpg/jpeg/png/bmp格式,大小不超过4M，最短边至少15px，最长边最大4096px</Tile
          >
          <FileUploaderDropContainer
            class="mt-4"
            multiple
            accept="image/jpg,image/jpeg,image/png,image/bmp"
            labelText="上传图片"
            bind:ref={fileInputEl}
            on:add={fileUpload}
          />
        </div>
        <div
          class="border border-solid border-gray-500 p-2 overflow-y-auto gap-y-2 max-h-80"
        >
          {#if files.length}
            {#each files as filer, i}
              <FileUploaderItem
                name={filer.file.name}
                status={filer.status}
                invalid={filer.invalid}
                on:delete={() => deleteFile(i)}
                errorSubject={filer.errorSubject}
              />
            {/each}
          {:else}
            <div>空</div>
          {/if}
        </div>
      {/if}
    </TabContent>
    <TabContent>待开发</TabContent>
    <TabContent>待开发</TabContent>
  </div>
</Tabs>
<hr />
<div class="flex items-center justify-center p-4">
  <ButtonSet>
    <Button on:click={ocrInvoiceAct} icon={DirectionStraightRight20}
      >开始识别</Button
    >
  </ButtonSet>
</div>
<hr />

{#if tables.length}
  <DataTable
    headers={[
      {
        key: 'Agent',
        value: '是否代开'
      },
      {
        key: 'AmountInFiguers',
        value: '价税合计(小写)'
      },
      {
        key: 'AmountInWords',
        value: '价税合计(大写)'
      }
    ]}
    rows={tables.map((table) => ({
      ...table,
      ...table.words_result,
      id: table.log_id
    }))}
  />
  <hr class="my-4" />
  <div class="flex items-center justify-center p-4">
    <ButtonSet>
      <Button on:click={exportExcel}>导出</Button>
    </ButtonSet>
  </div>
{/if}
