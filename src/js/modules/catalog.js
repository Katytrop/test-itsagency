// подгрузка данных и вывод карточек товаров
const catalog = document.querySelector('.products-catalog__items');
const quantityElement = document.querySelector('.catalog-header__quantity');
let allProducts = [];

async function loadProducts() {
    const response = await fetch('https://68789e4b63f24f1fdc9eae95.mockapi.io/api/v1/products');
    allProducts = await response.json();
    renderProducts(allProducts);
}

function renderProducts(products) {
    catalog.innerHTML = '';
    quantityElement.textContent = `${products.length} ${decline(products.length, ['товар', 'товара', 'товаров'])}`;

    products.forEach(item => {
        const productHTML = `
        <div class="product" data-id="${item.id}">
            <a href="#" class="product__link"></a>
            <img class="product__image" src="${item.image}" alt="${item.title}">
            <h3 class="product__title">${item.title}</h3>
            <div class="product__bottom">
                <div class="product__price">${item.price} ₽</div>
                <button class="product__btn add-to-cart">
                    <img class="product__plus" src="./img/icons/plus.svg" alt="plus">
                </button>
            </div>
            
        </div>
        `;
        catalog.insertAdjacentHTML('beforeend', productHTML);
    });  
}

document.addEventListener('DOMContentLoaded', () => {
  loadProducts();
});

function decline(number, words) {
    number = Math.abs(number) % 100;
    const n1 = number % 10;

    if (number > 10 && number < 20) return words[2];
    if (n1 > 1 && n1 < 5) return words[1];
    if (n1 === 1) return words[0];
    return words[2];
}

// фильтры
const filters = document.querySelectorAll('.filters-catalog__checkbox');

filters.forEach(filter => {
    filter.addEventListener('change', () => {
        applyFilters();
    });
});

function applyFilters() {
    const activeFilters = Array.from(filters)
        .filter(f => f.checked)
        .map(f => f.value);

    if (activeFilters.length === 0) {
        renderProducts(allProducts);
        return;
    }

    const filtered = allProducts.filter(product => {
        return activeFilters.some(filter => {
        if (filter === 'новинки') return product.isNew;
        if (filter === 'есть в наличии') return product.isStock;
        if (filter === 'контрактные') return product.type === 'contract';
        if (filter === 'эксклюзивные') return product.type === 'exclusive';
        if (filter === 'распродажа') return product.isSale;
        return false;
        });
    });

    renderProducts(filtered);
}

const toggleButton = document.querySelector('.filters-catalog__title');
const filtersPanel = document.querySelector('.filters-catalog__items');
const cover = document.querySelector('.cover')

if (toggleButton && filtersPanel) {
    toggleButton.addEventListener('click', () => {
    filtersPanel.classList.toggle('active');
    cover.classList.toggle('active');
});

document.addEventListener('click', (e) => {
    const isClickInside =
        filtersPanel.contains(e.target) ||
        toggleButton.contains(e.target) ||
        cartModal.contains(e.target) || 
        cartCountIcon.contains(e.target)||
        e.target.closest('.cart-item');

    if (!isClickInside && filtersPanel.classList.contains('active')) {
        filtersPanel.classList.remove('active'); 
        cover.classList.remove('active');
    }
});
}

// сортировка
const dropdown = document.querySelector('.sort-dropdown');
const dropdownButton = dropdown.querySelector('.sort-dropdown__button');
const dropdownLabel = dropdown.querySelector('.sort-dropdown__label');
const dropdownItems = dropdown.querySelectorAll('li[data-sort]');

dropdownButton.addEventListener('click', () => {
    dropdown.classList.toggle('active');
    cover.classList.toggle('active');
});

document.addEventListener('click', (e) => {
    const isClickInside =
        dropdown.contains(e.target) ||
        cartModal.contains(e.target) ||
        cartCountIcon.contains(e.target)||
        e.target.closest('.cart-item');

    if (!isClickInside) {
        dropdown.classList.remove('active');
        cover.classList.remove('active');
    }
});

dropdownItems.forEach(item => {
    item.addEventListener('click', () => {
        const sortType = item.dataset.sort;

        dropdownLabel.textContent = item.textContent;
        dropdownItems.forEach(i => i.classList.remove('active'));
        item.classList.add('active');

        dropdown.classList.remove('active');
        cover.classList.toggle('active');

        let sortedProducts = [...allProducts];

        if (sortType === 'expensive') {
            sortedProducts.sort((a, b) => b.price - a.price);
        } else if (sortType === 'cheap') {
            sortedProducts.sort((a, b) => a.price - b.price);
        } else if (sortType === 'new') {
            sortedProducts.sort((a, b) => {
                return (b.isNew === true) - (a.isNew === true);
            });
        }

        renderProducts(sortedProducts);
    });
});

// корзина
let cart = [];
const cartCountElement = document.querySelector('.actions__icon--cart');
catalog.addEventListener('click', (e) => {
    const button = e.target.closest('.add-to-cart');
    if (!button) return;

    const productCard = button.closest('.product');
    const title = productCard.querySelector('.product__title').textContent;
    const price = productCard.querySelector('.product__price').textContent;
    const image = productCard.querySelector('.product__image').src;
    const id = productCard.dataset.id;

    const product = {
        id,
        title,
        price,
        image,
        count: 1,
    };

    const existing = cart.find(item => item.id === product.id);
    if (existing) {
        existing.count += 1;
    } else {
        cart.push(product);
    }
    updateCartCount();
    console.log('Корзина:', cart);
});

function updateCartCount() {
    const total = cart.reduce((sum, item) => sum + item.count, 0);
    if (cartCountElement) {
        cartCountElement.textContent = total;
    }
}

const cartModal = document.querySelector('.cart-modal');
const cartCloseBtn = document.querySelector('.cart-modal__close');
const cartCountIcon = document.querySelector('.actions__item--cart');
const cartCountText = document.querySelector('.cart-modal__count');
const cartClearBtn = document.querySelector('.cart-modal__clear');

cartCountIcon.addEventListener('click', () => {
    cartModal.classList.add('active');
    cover.classList.add('active');
    renderCartModal();
});

cover.addEventListener('click', () => {
    cartModal.classList.remove('active');
    cover.classList.remove('active');
});

cartCloseBtn.addEventListener('click', () => {
    cartModal.classList.remove('active');
    cover.classList.remove('active');
});


function renderCartModal() {
    const container = document.querySelector('.cart-modal__items');
    const totalElement = document.querySelector('.cart-modal__sum');

    container.innerHTML = '';

    if (cart.length === 0) {
        container.innerHTML = `<div class="cart-modal__empty">Корзина пуста</div>`;
        totalElement.textContent = '0 ₽';

        if (cartCountText) {
            cartCountText.textContent = '0 товаров';
        }

        return;
    }

    let total = 0;
    let totalItems = 0;

    cart.forEach(item => {
        const priceNum = parseInt(item.price);
        total += item.count * priceNum;
        totalItems += item.count;

        const html = `
        <div class="cart-modal__item cart-item" data-id="${item.id}">
            <div class="cart-item__content">
                <img class="cart-item__image" src="${item.image}" alt="${item.title}">
                <div>
                    <div class="cart-item__name">${item.title}</div>
                    <div class="cart-item__price">${priceNum} ₽</div>
                </div>
            </div>
            
            <div class="cart-item__actions actions-cart">
                <div class="actions-cart__quantity">
                    <button class="actions-cart__minus">−</button>
                    <span>${item.count}</span>
                    <button class="actions-cart__plus">+</button>
                </div>
                <button class="actions-cart__delete">
                     <img src="./img/icons/delete.svg" alt="delete">
                </button>
            </div>
        </div>
        `;
        container.insertAdjacentHTML('beforeend', html);
    });

    totalElement.textContent = `${total.toLocaleString('ru-RU')} ₽`;
    if (cartCountText) {
        cartCountText.textContent = `${totalItems} ${decline(totalItems, ['товар', 'товара', 'товаров'])}`;
    }
}

cartClearBtn.addEventListener('click', () => {
    cart = [];
    updateCartCount();
    renderCartModal();
});

document.querySelector('.cart-modal__items').addEventListener('click', (e) => {
    const btn = e.target.closest('button');
    if (!btn) return;

    const itemEl = e.target.closest('.cart-item');
    if (!itemEl) return;

    const id = itemEl.dataset.id;
    const product = cart.find(p => p.id === id);
    if (!product) return;

    if (btn.classList.contains('actions-cart__plus')) {
        product.count += 1;
    }

    if (btn.classList.contains('actions-cart__minus')) {
        product.count -= 1;
        if (product.count <= 0) {
            cart = cart.filter(p => p.id !== id);
        }
    }

    if (btn.classList.contains('actions-cart__delete')) {
        cart = cart.filter(p => p.id !== id);
    }

    updateCartCount();
    renderCartModal();
});