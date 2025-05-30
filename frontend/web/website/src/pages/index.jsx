import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const IndexPage = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // Redirect to the visitor landing page
    navigate("/visitor");
  }, [navigate]);

  return null; // No need to render anything as we're redirecting
};

export default IndexPage;
