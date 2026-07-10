import React from "react";
import "../componentStyles/Pagination.css";
import { useSelector } from "react-redux";

const Pagination = ({
  currentPage,
  onPageChange,
  totalPages,
  activeClass = "active",
  nextPageText = "Next",
  prevPageText = "Prev",
  firstPageText = "1st",
  lastPageText = "Last",
}) => {
  if (totalPages <= 1) return null;

  // Generate Page Number
  const getPageNumber = () => {
    const pageNumbers = [];
    const pageWindow = 1;
    for (
      let i = Math.max(1, currentPage - pageWindow);
      i <= Math.min(totalPages, currentPage + pageWindow);
      i++
    ) {
      pageNumbers.push(i);
    }
    return pageNumbers;
  };
  return (
    <div className="pagination">
      {/* first and Prev button */}
      {currentPage > 1 && (
        <>
          <button className="pagination-btn" onClick={() => onPageChange(1)}>
            {firstPageText}
          </button>
          <button
            className="pagination-btn"
            onClick={() => onPageChange(currentPage - 1)}
          >
            {prevPageText}
          </button>
        </>
      )}
    {/* Display number */}
    {
      getPageNumber().map((number)=>(
        <button className={`pagination-btn ${currentPage===number?activeClass:''}`} 
        key={number} 
        onClick={()=>onPageChange(number)}>
        {number}</button>
      ))
    }


      {/* last and next button */}
      {currentPage < totalPages && (
        <>
          <button
            className="pagination-btn"
            onClick={() => onPageChange(currentPage + 1)}
          >
            {nextPageText}
          </button>
          <button
            className="pagination-btn"
            onClick={() => onPageChange(totalPages)}
          >
            {lastPageText}
          </button>
        </>
      )}
    </div>
  );
};

export default Pagination;
