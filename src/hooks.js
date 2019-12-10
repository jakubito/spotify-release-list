export function modalEffect(closeModal) {
  const escHandler = ({ key }) => {
    if (['Esc', 'Escape'].includes(key)) {
      closeModal();
    }
  };

  window.addEventListener('keydown', escHandler);
  document.documentElement.classList.add('is-clipped');

  return () => {
    window.removeEventListener('keydown', escHandler);
    document.documentElement.classList.remove('is-clipped');
  };
}
