document.addEventListener('DOMContentLoaded', () => { 

    const filters = document.querySelectorAll('.filters-catalog__checkbox');
    const toggleButton = document.querySelector('.filters-catalog__title');
    const filtersPanel = document.querySelector('.filters-catalog__items');

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

    if (toggleButton && filtersPanel) {
        const cover = document.querySelector('.cover');

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
});