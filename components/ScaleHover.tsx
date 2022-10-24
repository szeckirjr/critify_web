import { Box } from "@mui/material";
import { useEffect, useRef, useState } from "react";
import gsap from "gsap";

const ScaleHover = ({
  children,
  disable,
}: {
  children: JSX.Element;
  disable: boolean;
}): JSX.Element => {
  const [raised, setRaised] = useState(false);
  const cardRef = useRef();
  useEffect(() => {
    if (raised) {
      gsap.to(cardRef.current as unknown as HTMLDivElement, {
        // y: -50,
        scale: 1.1,
        // rotationY: 360,
        duration: 0.5,
        ease: "power4",
      });
    } else {
      gsap.to(cardRef.current as unknown as HTMLDivElement, {
        // y: 0,
        scale: 1,
        // rotationY: 0,
        duration: 0.2,
        ease: "slow",
      });
    }
  }, [raised]);
  return disable ? (
    children
  ) : (
    <Box
      bgcolor="transparent"
      ref={cardRef}
      onMouseOver={() => setRaised(true)}
      onMouseOut={() => setRaised(false)}
    >
      {children}
    </Box>
  );
};

export default ScaleHover;
