import { Img } from "@react-email/components";
import { LOGO_HEIGHT, LOGO_URL, LOGO_WIDTH, logo } from "./styles";

/** The YUNIK wordmark. Every email shows it once, at the top, and nowhere else. */
export default function Logo() {
  return (
    <Img
      src={LOGO_URL}
      alt="YUNIK"
      width={LOGO_WIDTH}
      height={LOGO_HEIGHT}
      style={logo}
    />
  );
}
