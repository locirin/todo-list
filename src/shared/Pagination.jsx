import styles from './Pagination.module.css';

function Pagination({ currentPage, totalPages, onPrev, onNext }) {
  return (
    <div className={styles.pagination}>
      <button onClick={onPrev} disabled={currentPage === 1}>
        Previous
      </button>
      <span>
        Page {currentPage} of {totalPages}
      </span>
      <button onClick={onNext} disabled={currentPage === totalPages}>
        Next
      </button>
    </div>
  );
}

export default Pagination;
