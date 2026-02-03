import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function CityLanding() {
  const navigate = useNavigate();

  useEffect(() => {
    // Redirect to tuition request page
    navigate('/tuition-request');
  }, [navigate]);

  return null;
}
