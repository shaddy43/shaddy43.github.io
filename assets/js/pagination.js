// Paginates cards that are already rendered in the page by Jekyll.
// If this script doesn't run, the controls stay hidden and every card is visible.
//
// Returns a small handle so a section can also be filtered (see posts-filter.js):
// setFilter(fn) narrows the paged set to the cards fn accepts, resets to page 1
// and returns how many matched.
function initPagination(sectionId, cardsPerPage) {
    const section = document.getElementById(sectionId);
    if (!section) return null;

    const container = section.querySelector('.card-container, .card-container-square, .repo-grid');
    const controls = section.querySelector('.pagination-controls');
    const prevBtn = controls.querySelector('.prev-btn');
    const nextBtn = controls.querySelector('.next-btn');
    const pageNumber = controls.querySelector('.page-number');

    const allCards = Array.from(container.children);
    let matches = () => true;
    let visible = allCards;
    let totalPages = 1;
    let currentPage = 1;

    function recount() {
        visible = allCards.filter(matches);
        totalPages = Math.max(1, Math.ceil(visible.length / cardsPerPage));
        if (currentPage > totalPages) currentPage = totalPages;
    }

    function render() {
        const start = (currentPage - 1) * cardsPerPage;
        allCards.forEach(card => { card.style.display = 'none'; });
        visible.slice(start, start + cardsPerPage).forEach(card => { card.style.display = ''; });

        pageNumber.textContent = currentPage + ' / ' + totalPages;
        prevBtn.disabled = currentPage === 1;
        nextBtn.disabled = currentPage === totalPages;
        // Nothing to page through when everything already fits on one page.
        controls.hidden = totalPages <= 1;
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

    recount();
    render();

    return {
        setFilter(fn) {
            matches = fn || (() => true);
            currentPage = 1;
            recount();
            render();
            return visible.length;
        }
    };
}

// Exposed so posts-filter.js can drive the same pager rather than fighting it.
window.postsPager = initPagination('recent-posts', 3);
initPagination('projects', 4);
