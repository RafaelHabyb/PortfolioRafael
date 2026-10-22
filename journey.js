(() => {
  const word = document.querySelector('#journey-word');
  const controls = document.querySelector('.journey-controls');
  const buttons = [...document.querySelectorAll('[data-topic]')];
  const motion = window.matchMedia('(prefers-reduced-motion: reduce)');
  const topics = ['programação', 'inteligência artificial', 'automação'];
  let index = 0;
  let paused = motion.matches;
  let timer;
  let animation;

  function show(next) {
    index = next;
    word.textContent = topics[index];
    buttons.forEach((button, i) => button.setAttribute('aria-pressed', String(i === index)));
    animation?.cancel();
    if (!motion.matches && word.animate) {
      animation = word.animate([
        { opacity: 0, transform: 'translateY(8px)' },
        { opacity: 1, transform: 'translateY(0)' }
      ], { duration: 350, easing: 'ease-out' });
    }
  }

  function schedule() {
    clearInterval(timer);
    if (!paused && !document.hidden) {
      timer = setInterval(() => show((index + 1) % topics.length), 4000);
    }
  }

  buttons.forEach((button, i) => button.addEventListener('click', () => {
    show(i);
    schedule();
  }));
  motion.addEventListener('change', () => {
    paused = motion.matches;
    if (motion.matches) animation?.cancel();
    schedule();
  });
  document.addEventListener('visibilitychange', schedule);
  controls.hidden = false;
  schedule();
})();
