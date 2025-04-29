import logo from './img/reports-300.png'; // Assuming Webpack or similar setup

let b64 = '';
export const getReportLogo = async (): Promise<string> => {
  if (b64) {
    return b64;
  }
  const res = await fetch(logo);
  const b = await res.blob();
  b64 = await blobToBase64(b);
  return b64;
};

function blobToBase64(blob: Blob): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => resolve(reader.result as string);
    reader.onerror = reject;
    reader.readAsDataURL(blob);
  });
}
