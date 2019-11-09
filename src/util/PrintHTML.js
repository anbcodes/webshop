export default function print(element) {
  const iframe = document.createElement('iframe');

  return new Promise((resolve) => {
    iframe.onload = () => {
      iframe.contentDocument.body.appendChild(element);

      setTimeout(() => {
        iframe.contentWindow.focus();
        iframe.contentWindow.print();

        resolve();

        window.setTimeout(() => { iframe.remove(); }, 5);
      }, 2000);
    };
    document.body.appendChild(iframe);
  });
}
