import { Project, ScriptTarget, SourceFile } from "ts-morph";
import { resolve as pathResolve, dirname, relative } from "node:path";
import { readFile, mkdir, writeFile } from "node:fs/promises";
import * as vueCompiler from "vue/compiler-sfc";
import glob from "fast-glob";

async function buildDeclaration() {
  console.log("building the typescript declaration file");
  const project = new Project({
    compilerOptions: {
      emitDeclarationOnly: true,
      target: ScriptTarget.ESNext,
    },
    tsConfigFilePath: pathResolve(__dirname, "..", "..", "tsconfig.json"),
  });
  const files = await glob("**/*.{js?(x),ts?(x),vue}", {
    cwd: pathResolve(__dirname, "..", "..", "packages"),
    absolute: true,
    onlyFiles: true,
  });
  const sourceFiles: SourceFile[] = [];
  Promise.all([
    ...files.map(async (val) => {
      console.log("files", val);
      if (val.endsWith(".vue")) {
        const content = await readFile(val, "utf-8");
        const hasTsNoCheck = content.includes("@ts-nocheck");
        const sfc = vueCompiler.parse(content);
        const { script, scriptSetup } = sfc.descriptor;
        if (script || scriptSetup) {
          let content =
            (hasTsNoCheck ? "// @ts-nocheck\n" : "") + (script?.content ?? "");

          if (scriptSetup) {
            const compiled = vueCompiler.compileScript(sfc.descriptor, {
              id: "xxx",
            });
            content += compiled.content;
          }

          const lang = scriptSetup?.lang || script?.lang || "js";
          const sourceFile = project.createSourceFile(
            `${relative(process.cwd(), val)}.${lang}`,
            content
          );
          sourceFiles.push(sourceFile);
        }
      } else {
        const sourceFile = project.addSourceFileAtPath(val);
        sourceFiles.push(sourceFile);
      }
      // const sourceFile = project.createSourceFile(
      //   pathResolve(__dirname, "dist", val),
      //   await readFile(val, "utf-8")
      // );
      // sourceFiles.push(sourceFile);
    }),
  ]);

  const tasks = sourceFiles.map(async (val) => {
    const emitOutput = val.getEmitOutput();
    const emitFiles = emitOutput.getOutputFiles();
    if (emitFiles.length === 0) {
      throw new Error(`Emit no file`);
    }

    const subTasks = emitFiles.map(async (outputFile) => {
      const filepath = outputFile.getFilePath();
      const writePath = ;
      console.log("out file", filepath, dirname(writePath), filepath);
      await mkdir(writePath, { recursive: true });
      await writeFile(
        pathResolve(writePath, filepath.replace(dirname(filepath), "")),
        outputFile.getText(),
        "utf8"
      );
    });
    await Promise.all(subTasks);
  });
  await Promise.all(tasks);
}

export default buildDeclaration;
