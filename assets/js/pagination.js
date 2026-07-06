// Paginates cards that are already rendered in the page by Jekyll.
// If this script doesn't run, the controls stay hidden and every card is visible.
function initPagination(sectionId, cardsPerPage) {
    const section = document.getElementById(sectionId);
    if (!section) return;

    const container = section.querySelector('.card-container, .card-container-square');
    const controls = section.querySelector('.pagination-controls');
    const prevBtn = controls.querySelector('.prev-btn');
    const nextBtn = controls.querySelector('.next-btn');
    const pageNumber = controls.querySelector('.page-number');

    const cards = Array.from(container.children);
    const totalPages = Math.max(1, Math.ceil(cards.length / cardsPerPage));
    let currentPage = 1;

    function render() {
        const start = (currentPage - 1) * cardsPerPage;
        const end = start + cardsPerPage;
        cards.forEach((card, i) => {
            card.style.display = (i >= start && i < end) ? '' : 'none';
        });
        pageNumber.textContent = currentPage + ' / ' + totalPages;
        prevBtn.disabled = currentPage === 1;
        nextBtn.disabled = currentPage === totalPages;
    }

    prevBtn.addEventListener('click', () => {
        if (currentPage > 1) {
            currentPage--;
            render();
        }
    });

    nextBtn.addEventListener('click', () => {
        if (currentPage < totalPages) {
            currentPage++;
            render();
        }
    });

    controls.hidden = false;
    render();
}

initPagination('recent-posts', 3);
initPagination('projects', 2);
