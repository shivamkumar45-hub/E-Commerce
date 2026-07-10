import React, { useEffect } from 'react'

const PageTitle = ({ title }) => {

  useEffect(() => {
    document.title = `${title} - MERN Ecommerce`;
  }, [title]);

  return null;
}

export default PageTitle