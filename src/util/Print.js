export default function print(element) {
  const iframe = document.createElement('iframe');
  iframe.onload = async () => {
    iframe.contentDocument.body.appendChild(element);
    iframe.contentWindow.focus();
    iframe.contentWindow.print();
    window.setTimeout(() => { iframe.remove(); }, 5);
  };
  document.body.appendChild(iframe);
}
