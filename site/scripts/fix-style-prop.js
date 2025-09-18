const fs = require("fs");
const path = require("path");
const { parse } = require("@babel/parser");
const traverse = require("@babel/traverse").default;
const generate = require("@babel/generator").default;
const t = require("@babel/types");

const exts = new Set([".jsx", ".tsx", ".mdx"]);
const root = process.argv[2] || process.cwd();
const UNITLESS = new Set(["lineHeight", "opacity", "zIndex", "flex", "fontWeight"]);
const toCamel = s => s.replace(/-([a-z])/g, (_, c) => c.toUpperCase());
function valueToAst(v, k) { const val = v.trim(); if (UNITLESS.has(k) && /^[0-9.]+$/.test(val)) return t.numericLiteral(Number(val)); return t.stringLiteral(val); }
function fencesFor(src){const arr=[];const re=/(^|\n)(`{3,}|~{3,})[^\n]*\n[\s\S]*?\n\2(?=\n|$)/g;let m;while((m=re.exec(src)))arr.push([m.index,re.lastIndex]);return arr;}
const inFence=(i,f)=>f.some(([s,e])=>i>=s&&i<e);
function cssToObj(css){const props=[];css.split(";").forEach(p=>{const seg=p.trim(); if(!seg)return; const i=seg.indexOf(":"); if(i<0)return; const k=toCamel(seg.slice(0,i).trim()); const v=seg.slice(i+1); props.push(t.objectProperty(t.identifier(k), valueToAst(v,k)));}); return t.objectExpression(props);}
function processFile(fp){
  const code=fs.readFileSync(fp,"utf8"); const fences=fencesFor(code);
  const isTS=fp.endsWith(".tsx"); const isMDX=fp.endsWith(".mdx");
  const ast=parse(code,{sourceType:"module",plugins:["jsx",isTS&&"typescript",isMDX&&"mdx"].filter(Boolean)});
  let changed=false;
  traverse(ast,{ JSXAttribute(p){ const n=p.node; if(n.name.name!=="style")return; if(n.loc && inFence(n.loc.start.index??0,fences))return; const v=n.value; if(t.isStringLiteral(v)){ n.value=t.jsxExpressionContainer(cssToObj(v.value)); changed=true; } }});
  if(changed){ const out=generate(ast,{jsescOption:{minimal:true}},code).code; fs.writeFileSync(fp,out); console.log("Fixed:",fp); }
}
function walk(dir){ for(const name of fs.readdirSync(dir)){ const fp=path.join(dir,name); const st=fs.statSync(fp); if(st.isDirectory()){ if(["node_modules","build",".docusaurus","static"].includes(name))continue; walk(fp); } else if(exts.has(path.extname(fp))){ processFile(fp); } } }
walk(root);
