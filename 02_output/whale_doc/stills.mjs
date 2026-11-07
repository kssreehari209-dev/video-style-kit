// Renders test stills from one bundle: node stills.mjs <outDir> Comp:frame Comp:frame ...
import {bundle} from "@remotion/bundler";
import {getCompositions, renderStill} from "@remotion/renderer";
const [out, ...jobs] = process.argv.slice(2);
const serveUrl = await bundle({entryPoint: "src/index.ts"});
const comps = await getCompositions(serveUrl);
for (const job of jobs) {
  const [id, frame] = job.split(":");
  await renderStill({serveUrl, composition: comps.find((c) => c.id === id), frame: Number(frame), output: `${out}/${id}_${String(frame).padStart(4, "0")}.jpg`, imageFormat: "jpeg", jpegQuality: 88});
}
console.log("done", jobs.length);
