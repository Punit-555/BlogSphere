import * as React from "react";
import Accordion from "@mui/material/Accordion";
import AccordionSummary from "@mui/material/AccordionSummary";
import AccordionDetails from "@mui/material/AccordionDetails";
import Typography from "@mui/material/Typography";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import Fade from "@mui/material/Fade";
import userIcon from "../assets/user.png";
import { ImageList } from "@mui/material";
import { convertDate } from "../utility";

export default function CommentComponent({ comments }) {
  const [expanded, setExpanded] = React.useState(false);

  const handleExpansion = () => {
    setExpanded((prevExpanded) => !prevExpanded);
  };

  return (
    <div className="comment_container">
      <Accordion
        expanded={expanded}
        onChange={handleExpansion}
        slots={{ transition: Fade }}
        slotProps={{ transition: { timeout: 400 } }}
        sx={[
          expanded
            ? {
                "& .MuiAccordion-region": {
                  height: "auto",
                },
                "& .MuiAccordionDetails-root": {
                  display: "block",
                },
              }
            : {
                "& .MuiAccordion-region": {
                  height: 0,
                },
                "& .MuiAccordionDetails-root": {
                  display: "none",
                },
              },
        ]}
      >
        <AccordionSummary
          expandIcon={<ExpandMoreIcon />}
          aria-controls="panel1-content"
          id="panel1-header"
        >
          <img src={userIcon} alt="" height={24} width={27} />
          &nbsp; &nbsp;
          <Typography>{comments?.comment_user_name}</Typography>
          <Typography
            style={{
              fontSize: "0.875rem",
              fontWeight: "400",
              color: "gray",
              position: "relative",
              top: "2px",
              left: "20px",
            }}
          >
            {convertDate(comments?.comment_created_at)}
          </Typography>
        </AccordionSummary>

        <AccordionDetails>
          <Typography>{comments?.comment}</Typography>
        </AccordionDetails>
      </Accordion>
    </div>
  );
}
