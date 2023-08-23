export const copyUrl = () => {
  const url = document.location.href

  // TODO better success message, modal window probably
  navigator.clipboard.writeText(url)
    .then(() => {
      alert('Permalink copied to clipboard!');
    }).catch(e => {
      console.error('Copy error', e);
    });
}