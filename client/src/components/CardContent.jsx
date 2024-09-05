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
  const limit = 18;
  const truncatedText = truncateText(text, limit);
  const navigate = useNavigate();

  return (
    <div>
      <button
        className="card_arrow_icon arrow_btn"
        onClick={() => {
          console.log("skdjfbjsdfbjahvb");
          navigate(`/blog-details/${val?.id}`);
        }}
      >
        Read more &nbsp;
        <FaArrowRight />
      </button>
      <p>{isExpanded ? text : truncatedText}</p>
      {text.split(" ").length > limit && (
        <p
          onClick={() => {
            console.log("skdjfbjsdfbjahvb");
            navigate(`/blog-details/${val?.id}`);
          }}
        >
          {isExpanded ? "Show Less" : "Continue reading..."}
        </p>
      )}
    </div>
  );
};

export default CardContent;
