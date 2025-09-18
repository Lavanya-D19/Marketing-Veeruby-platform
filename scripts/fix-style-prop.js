const fs = require("fs");
const path = require("path");
const { parse } = require("@babel/parser");
const traverse = require("@babel/traverse").default;
const generate = require("@babel/generator").default;
const t = require("@babel/types");

const exts = new Set([".jsx", ".tsx", ".mdx"]);
const root = process.argv[2] || process.cwd();

function toCamel(s) {
  return s.replace(/-([a-z])/g, (_, c) => c.toUpperCase());
}
const UNITLESS = new Set(["lineHeight", "opacity", "zIndex", "flex", "fontWeight"]);

function valueToAst(val, key) {
  const trimmed = val.trim();
  if (UNITLESS.has(key) && /^[0-9.]+$/.test(trimmed)) {
    return t.numericLiteral(Number(trimmed));
  }
  return t.stringLiteral(trimmed);
}

// crude detector to avoid transforming fenced MDX code blocks
function maskFencedCodeBlocks(src) {
  const fences = [];
  const fenceRe = /(^|\n)(`{3,}|~{3,})[^\n]*\n[\s\S]*?\n\2(?=\n|$)/g;
  let m;
  while ((m = fenceRe.exec(src))) {
    fences.push([m.index, fenceRe.lastIndex]);
  }
  return { src, fences };
}
function inFenced(index, fences) {
  return fences.some(([s, e]) => index >= s && index < e);
}

function cssStringToObjectExpression(css) {
  const props = [];
  css.split(";").forEach(part => {
    const segment = part.trim();
    if (!segment) return;
    const colonIdx = segment.indexOf(":");
    if (colonIdx === -1) return;
    const rawK = segment.slice(0, colonIdx).trim();
    const rawV = segment.slice(colonIdx + 1).trim();
    if (!rawK) return;
    const key = toCamel(rawK);
    props.push(t.objectProperty(t.identifier(key), valueToAst(rawV, key)));
  });
  return t.objectExpression(props);
}

function processFile(fp) {
  const orig = fs.readFileSync(fp, "utf8");
  const { src, fences } = maskFencedCodeBlocks(orig);
  const isTS = fp.endsWith(".tsx");
  const isMDX = fp.endsWith(".mdx");

  const ast = parse(src, {
    sourceType: "module",
    plugins: ["jsx", isTS && "typescript", isMDX && "mdx"].filter(Boolean),
  });

  let changed = false;

  traverse(ast, {
    JSXAttribute(path) {
      const node = path.node;
      if (node.name.name !== "style") return;
      // Avoid replacing style inside fenced MDX code by checking source location
      if (node.loc && inFenced(node.loc.start.index ?? 0, fences)) return;

      const val = node.value;
      if (!t.isStringLiteral(val)) return;
      const obj = cssStringToObjectExpression(val.value);
      node.value = t.jsxExpressionContainer(obj);
      changed = true;
    },
  });

  if (changed) {
    const out = generate(ast, { jsescOption: { minimal: true } }, src).code;
    fs.writeFileSync(fp, out);
    console.log("Fixed:", fp);
  }
}

function walk(dir) {
  for (const name of fs.readdirSync(dir)) {
    const fp = path.join(dir, name);
    const stat = fs.statSync(fp);
    if (stat.isDirectory()) {
      if (name === "node_modules" || name === "build" || name === ".docusaurus") continue;
      walk(fp);
    } else if (exts.has(path.extname(fp))) {
      processFile(fp);
    }
  }
}
walk(root);
