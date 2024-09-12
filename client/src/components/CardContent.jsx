import { useState } from "react";
import { FaArrowRight } from "react-icons/fa6";
import { useNavigate } from "react-router-dom";

const CardContent = ({ text, val }) => {
  const truncateText = (text, limit) => {
    const words = text.split(" ");
    if (words.length <= limit) return text;
    return words.slice(0, limit).join(" ") + "...";
  };
  const [isExpanded, setIsExpanded] = useState(false);
  const limit = 20;
  const truncatedText = truncateText(text, limit);
  const navigate = useNavigate();

  return (
    <div>
      <p>{isExpanded ? text : truncatedText}</p>
    </div>
  );
};

export default CardContent;
