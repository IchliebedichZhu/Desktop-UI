import { series } from "gulp";
import build from "./build/index";

export default series([
  async (done) => {
    await build();
    done();
  },
]) as () => void;
