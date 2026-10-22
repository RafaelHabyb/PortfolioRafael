(() => {
  const sections = [...document.querySelectorAll('main > section[id]')];
  const bar = document.querySelector('.journey-bar');
  const menu = document.querySelector('.site-menu');
  const links = [...menu.querySelectorAll('a')];
  const toggle = menu.querySelector('.menu-toggle');
  const compact = window.matchMedia('(max-width: 1000px)');
  menu.classList.add('menu-ready');
  toggle.hidden = false;

  function closeMenu(restoreFocus = false) {
    toggle.setAttribute('aria-expanded', 'false');
    if (restoreFocus && compact.matches) toggle.focus();
  }
  toggle.addEventListener('click', () => {
    toggle.setAttribute('aria-expanded', String(toggle.getAttribute('aria-expanded') !== 'true'));
  });
  document.addEventListener('click', event => {
    if (!menu.contains(event.target)) closeMenu();
  });
  document.addEventListener('keydown', event => {
    if (event.key === 'Escape' && toggle.getAttribute('aria-expanded') === 'true') closeMenu(true);
  });
  compact.addEventListener('change', () => {
    const active = document.activeElement;
    closeMenu(compact.matches && menu.contains(active));
    if (!compact.matches && active === toggle) links[0].focus();
  });


  sections.filter(section => section.id !== 'inicio').forEach(section => {
    const back = document.createElement('a');
    back.href = '#inicio';
    back.className = 'topic-back';
    back.textContent = '← Voltar ao início';
    const container = section.classList.contains('skills-section')
      ? section.querySelector('.wrap') : section;
    // The about section uses a two-column grid; span both columns.
    back.style.gridColumn = '1 / -1';
    container.prepend(back);
  });

  function render(focus = false) {
    closeMenu();
    const requested = location.hash.slice(1);
    const selected = sections.find(section => section.id === requested) || sections[0];
    sections.forEach(section => { section.hidden = section !== selected; });
    bar.hidden = selected.id !== 'inicio';
    document.body.classList.toggle('topic-view', selected.id !== 'inicio');
    links.forEach(link => {
      if (link.hash === '#' + selected.id) link.setAttribute('aria-current', 'page');
      else link.removeAttribute('aria-current');
    });
    if (focus) {
      const heading = selected.querySelector('h1, h2');
      heading.tabIndex = -1;
      heading.focus({ preventScroll: true });
      window.scrollTo({ top: 0, behavior: 'instant' });
    }
  }

  links.forEach(link => link.addEventListener('click', () => {
    if (link.hash === location.hash) render(true);
  }));
  window.addEventListener('hashchange', () => render(true));
  render();
})();
