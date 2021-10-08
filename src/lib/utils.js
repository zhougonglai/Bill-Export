export const fileByBase64 = (file, callback) => {
  let reader = new FileReader();
  reader.readAsDataURL(file);
  reader.onload = function (e) {
    // console.log(e.target.result);
    callback(e.target.result);
  };
};
