function Pagination({ page, totalPages, onPageChange }) {
    const pageCount = Math.max(totalPages, 1);
    const isFirst = page <= 0;
    const isLast = page >= pageCount - 1;

    return (
        <div className="pagination-bar">
            <button
                className="btn-pagination"
                disabled={isFirst}
                onClick={() => onPageChange(page - 1)}>
                [ Précédent ]
            </button>
            <span className="page-info">Page {page + 1} sur {pageCount}</span>
            <button
                className="btn-pagination"
                disabled={isLast}
                onClick={() => onPageChange(page + 1)}>
                [ Suivant ]
            </button>
        </div>
    );
}

export default Pagination;
