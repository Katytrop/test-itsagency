function burger() {
    const burger = document.querySelector('.icon-menu'),
          menu = document.querySelector('.menu__body'),
          cover = document.querySelector('.cover'),
          body = document.body;

    if (!burger || !menu || !cover) return;

    function closeMenu() {
        menu.classList.remove('menu-open');
        burger.classList.remove('menu-open');
        cover.classList.remove('active');
        body.classList.remove('disable_scroll');
    }

    function openMenu() {
        menu.classList.toggle('menu-open');
        burger.classList.toggle('menu-open');
        cover.classList.toggle('active');
        body.classList.toggle('disable_scroll');
    }

    burger.addEventListener('click', (e) => {
        e.stopPropagation();  
        openMenu();
    });

    cover.addEventListener('click', () => {
        closeMenu();
    });

    document.addEventListener('click', (e) => {
        if (!menu.contains(e.target) && !burger.contains(e.target) && menu.classList.contains('menu-open')) {
            closeMenu();
        }
    });

    const links = menu.querySelectorAll('a');
    links.forEach(link => {
        link.addEventListener('click', () => {
            closeMenu();
        });
    });
}

burger();