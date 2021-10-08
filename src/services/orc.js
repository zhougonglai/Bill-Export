import Cookies from 'js-cookie';

/**
 * 文字识别
 * @body image jpg/jpeg/png/bmp
 * @body url
 * @body pdf_file
 * @body pdf_file_num pdf 页码
 * @body type  { normal: 增值税普票、专票、电子发票, roll: 可识别增值税卷票 }
 * @returns
 */

export const orcInvoice = async (body) =>
  await fetch(
    `/api/ocr/vat_invoice?${new URLSearchParams({
      access_token: Cookies.get('access_token')
    })}`,
    {
      method: 'post',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      body: new URLSearchParams(body)
    }
  );
