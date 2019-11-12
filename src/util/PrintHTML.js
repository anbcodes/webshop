import Log from './Log';

export default function print(element) {
  const iframe = document.createElement('iframe');

  return new Promise((resolve) => {
    iframe.onload = () => {
      iframe.contentDocument.body.appendChild(element);

      setTimeout(() => {
        iframe.contentWindow.focus();
        Log(__filename, 'Printing HTML', { element, iframe });
        iframe.contentWindow.print();

        resolve();

        window.setTimeout(() => { iframe.remove(); }, 5);
      }, 2000);
    };
    document.body.appendChild(iframe);
  });
}
