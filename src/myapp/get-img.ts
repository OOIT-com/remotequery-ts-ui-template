import welcomePng from './img/welcome.png';

export const getWelcome = async (): Promise<string> => {
  let b64 = '';
  if (b64) {
    return b64;
  }
  const res = await fetch(welcomePng);
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
