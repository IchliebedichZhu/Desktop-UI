import { series } from "gulp";
import build from "./build/index";
import buildDeclaration from "./build/tsDeclaration";

export default series([
  async (done) => {
    await build();
    await buildDeclaration();
    done();
  },
]) as () => void;
