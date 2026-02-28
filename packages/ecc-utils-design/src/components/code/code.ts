import { LitElement, html, css } from "lit";
import { property, state } from "lit/decorators.js";
import { ComponentStyles as TailwindStyles } from "./tw-styles.js";
import { GlobalStyles } from "../../global.js";
import "ace-builds/src-noconflict/ace.js";
import "ace-builds/src-noconflict/theme-cloud9_day.js";
import "ace-builds/src-noconflict/theme-cloud9_night.js";

// Pre-load common modes to ensure they're available
import "ace-builds/src-noconflict/mode-javascript.js";
import "ace-builds/src-noconflict/mode-html.js";
import "ace-builds/src-noconflict/mode-css.js";
import "ace-builds/src-noconflict/mode-json.js";
import "ace-builds/src-noconflict/mode-python.js";
import "ace-builds/src-noconflict/mode-yaml.js";
import "ace-builds/src-noconflict/mode-xml.js";
import "ace-builds/src-noconflict/mode-markdown.js";
import "ace-builds/src-noconflict/mode-typescript.js";
import "ace-builds/src-noconflict/mode-text.js";
import "ace-builds/src-noconflict/mode-sh.js";
import "ace-builds/src-noconflict/mode-dockerfile.js";

// Complete list of all Ace supported languages based on available mode-*.js files
export type Language =
  | "abap"
  | "abc"
  | "actionscript"
  | "ada"
  | "alda"
  | "apache_conf"
  | "apex"
  | "applescript"
  | "aql"
  | "asciidoc"
  | "asl"
  | "assembly_arm32"
  | "assembly_x86"
  | "astro"
  | "autohotkey"
  | "basic"
  | "batchfile"
  | "bibtex"
  | "c9search"
  | "c_cpp"
  | "cirru"
  | "clojure"
  | "cobol"
  | "coffee"
  | "coldfusion"
  | "crystal"
  | "csharp"
  | "csound_document"
  | "csound_orchestra"
  | "csound_score"
  | "csp"
  | "css"
  | "csv"
  | "curly"
  | "cuttlefish"
  | "d"
  | "dart"
  | "diff"
  | "django"
  | "dockerfile"
  | "dot"
  | "drools"
  | "edifact"
  | "eiffel"
  | "ejs"
  | "elixir"
  | "elm"
  | "erlang"
  | "flix"
  | "forth"
  | "fortran"
  | "fsharp"
  | "fsl"
  | "ftl"
  | "gcode"
  | "gherkin"
  | "gitignore"
  | "glsl"
  | "gobstones"
  | "golang"
  | "graphqlschema"
  | "groovy"
  | "haml"
  | "handlebars"
  | "haskell"
  | "haskell_cabal"
  | "haxe"
  | "hjson"
  | "html"
  | "html_elixir"
  | "html_ruby"
  | "ini"
  | "io"
  | "ion"
  | "jack"
  | "jade"
  | "java"
  | "javascript"
  | "jexl"
  | "json"
  | "json5"
  | "jsoniq"
  | "jsp"
  | "jssm"
  | "jsx"
  | "julia"
  | "kotlin"
  | "latex"
  | "latte"
  | "less"
  | "liquid"
  | "lisp"
  | "livescript"
  | "logiql"
  | "logtalk"
  | "lsl"
  | "lua"
  | "luapage"
  | "lucene"
  | "makefile"
  | "markdown"
  | "mask"
  | "matlab"
  | "maze"
  | "mediawiki"
  | "mel"
  | "mips"
  | "mixal"
  | "mushcode"
  | "mysql"
  | "nasal"
  | "nginx"
  | "nim"
  | "nix"
  | "nsis"
  | "nunjucks"
  | "objectivec"
  | "ocaml"
  | "odin"
  | "partiql"
  | "pascal"
  | "perl"
  | "pgsql"
  | "php"
  | "php_laravel_blade"
  | "pig"
  | "plain_text"
  | "plsql"
  | "powershell"
  | "praat"
  | "prisma"
  | "prolog"
  | "properties"
  | "protobuf"
  | "prql"
  | "puppet"
  | "python"
  | "qml"
  | "r"
  | "raku"
  | "razor"
  | "rdoc"
  | "red"
  | "redshift"
  | "rhtml"
  | "robot"
  | "rst"
  | "ruby"
  | "rust"
  | "sac"
  | "sass"
  | "scad"
  | "scala"
  | "scheme"
  | "scrypt"
  | "scss"
  | "sh"
  | "sjs"
  | "slim"
  | "smarty"
  | "smithy"
  | "snippets"
  | "soy_template"
  | "space"
  | "sparql"
  | "sql"
  | "sqlserver"
  | "stylus"
  | "svg"
  | "swift"
  | "tcl"
  | "terraform"
  | "tex"
  | "text"
  | "textile"
  | "toml"
  | "tsv"
  | "tsx"
  | "turtle"
  | "twig"
  | "typescript"
  | "vala"
  | "vbscript"
  | "velocity"
  | "verilog"
  | "vhdl"
  | "visualforce"
  | "vue"
  | "wollok"
  | "xml"
  | "xquery"
  | "yaml"
  | "zeek"
  | "zig";

// Extension to language mapping
export const extensionToLanguage: Record<string, Language> = {
  // A
  abap: "abap",
  abc: "abc",
  as: "actionscript",
  adb: "ada",
  ads: "ada",
  alda: "alda",
  apache_conf: "apache_conf",
  htaccess: "apache_conf",
  cls: "apex",
  trigger: "apex",
  tgr: "apex",
  applescript: "applescript",
  scpt: "applescript",
  aql: "aql",
  adoc: "asciidoc",
  asciidoc: "asciidoc",
  asl: "asl",
  arm32: "assembly_arm32",
  asm: "assembly_x86",
  a: "assembly_x86",
  astro: "astro",
  ahk: "autohotkey",
  bas: "basic",
  basic: "basic",
  // B
  bat: "batchfile",
  cmd: "batchfile",
  bibtex: "bibtex",
  // C
  c: "c_cpp",
  cpp: "c_cpp",
  cc: "c_cpp",
  cxx: "c_cpp",
  h: "c_cpp",
  hpp: "c_cpp",
  hxx: "c_cpp",
  cirru: "cirru",
  clj: "clojure",
  cljs: "clojure",
  cljc: "clojure",
  edn: "clojure",
  cob: "cobol",
  cbl: "cobol",
  coffee: "coffee",
  cf_coffee: "coffee",
  cson: "coffee",
  cfm: "coldfusion",
  cfml: "coldfusion",
  cfc: "coldfusion",
  cr: "crystal",
  cs: "csharp",
  csd: "csound_document",
  orc: "csound_orchestra",
  sco: "csound_score",
  csp: "csp",
  css: "css",
  csv: "csv",
  curly: "curly",
  cf_cuttlefish: "cuttlefish",
  // D
  d: "d",
  dart: "dart",
  diff: "diff",
  patch: "diff",
  djt: "django",
  djhtml: "django",
  dockerfile: "dockerfile",
  Dockerfile: "dockerfile",
  dot: "dot",
  gv: "dot",
  drl: "drools",
  // E
  edi: "edifact",
  edifact: "edifact",
  e: "eiffel",
  ejs: "ejs",
  ex: "elixir",
  exs: "elixir",
  elm: "elm",
  erl: "erlang",
  hrl: "erlang",
  // F
  flix: "flix",
  frt: "forth",
  forth: "forth",
  fth: "forth",
  f: "fortran",
  f90: "fortran",
  f95: "fortran",
  fsharp: "fsharp",
  fsi: "fsharp",
  fsx: "fsharp",
  fsl: "fsl",
  ftl: "ftl",
  // G
  ga: "json",
  gcode: "gcode",
  nc: "gcode",
  feature: "gherkin",
  gitignore: "gitignore",
  glsl: "glsl",
  vert: "glsl",
  frag: "glsl",
  vs_glsl: "glsl",
  fs_glsl: "glsl",
  gbs: "gobstones",
  go: "golang",
  graphql: "graphqlschema",
  gql: "graphqlschema",
  groovy: "groovy",
  gradle: "groovy",
  // H
  haml: "haml",
  handlebars: "handlebars",
  hbs: "handlebars",
  hs: "haskell",
  cabal: "haskell_cabal",
  hx: "haxe",
  hjson: "hjson",
  html: "html",
  htm: "html",
  xhtml: "html",
  shtml: "html",
  heex: "html_elixir",
  erb: "html_ruby",
  html_ruby: "html_ruby",
  // I
  ini: "ini",
  cfg: "ini",
  prefs: "ini",
  conf_ini: "ini",
  io: "io",
  ion: "ion",
  // J
  jack: "jack",
  jade: "jade",
  pug: "jade",
  java: "java",
  js: "javascript",
  jsm: "javascript",
  jexl: "jexl",
  json: "json",
  json5: "json5",
  jsoniq: "jsoniq",
  jsp: "jsp",
  jssm: "jssm",
  jssm_state: "jssm",
  jsx: "jsx",
  jl: "julia",
  kt: "kotlin",
  kts: "kotlin",
  // L
  latex: "latex",
  ltx: "latex",
  bib_latex: "latex",
  latte: "latte",
  lat: "latte",
  less: "less",
  liquid: "liquid",
  lisp: "lisp",
  lsp: "lisp",
  lisp_scm: "lisp",
  ls: "livescript",
  logic: "logiql",
  logiql: "logiql",
  lg: "logtalk",
  lgt: "logtalk",
  lsl: "lsl",
  lua: "lua",
  lp: "luapage",
  lucene: "lucene",
  // M
  makefile: "makefile",
  mk: "makefile",
  mak: "makefile",
  md: "markdown",
  markdown: "markdown",
  mdown: "markdown",
  mkd: "markdown",
  mask: "mask",
  mat: "matlab",
  mz: "maze",
  wiki: "mediawiki",
  mediawiki: "mediawiki",
  mel: "mel",
  mips: "mips",
  s_mips: "mips",
  mix: "mixal",
  mixal: "mixal",
  mc: "mushcode",
  mush: "mushcode",
  mysql: "mysql",
  my: "mysql",
  // N
  nas: "nasal",
  nasal: "nasal",
  nginx: "nginx",
  nginxconf: "nginx",
  nim: "nim",
  nix: "nix",
  nsi: "nsis",
  nsh: "nsis",
  njk: "nunjucks",
  nunjucks: "nunjucks",
  // O
  obj_m: "objectivec",
  mm: "objectivec",
  ml: "ocaml",
  mli: "ocaml",
  odin: "odin",
  // P
  partiql: "partiql",
  pql: "partiql",
  pas: "pascal",
  p_pascal: "pascal",
  pp_pascal: "pascal",
  perl: "perl",
  pm: "perl",
  pl_perl: "perl",
  t_perl: "perl",
  pgsql: "pgsql",
  psql: "pgsql",
  php: "php",
  php5: "php",
  phtml: "php",
  inc: "php",
  blade: "php_laravel_blade",
  "blade.php": "php_laravel_blade",
  pig: "pig",
  plain_text: "plain_text",
  text_plain: "plain_text",
  plsql: "plsql",
  pls: "plsql",
  sql_plsql: "plsql",
  ps1: "powershell",
  psm1: "powershell",
  psd1: "powershell",
  praat: "praat",
  prisma: "prisma",
  prolog: "prolog",
  pro_prolog: "prolog",
  properties: "properties",
  prop: "properties",
  proto: "protobuf",
  prql: "prql",
  pp_puppet: "puppet",
  py: "python",
  pyw: "python",
  pyi: "python",
  // Q
  qml: "qml",
  // R
  r: "r",
  R_r: "r",
  rdata: "r",
  rds: "r",
  raku: "raku",
  rakumod: "raku",
  rakudoc: "raku",
  rakutest: "raku",
  p6: "raku",
  pl6: "raku",
  cshtml: "razor",
  razor: "razor",
  rd: "rdoc",
  rdoc: "rdoc",
  red: "red",
  reds: "red",
  rql: "redshift",
  rhtml: "rhtml",
  robot: "robot",
  rst: "rst",
  rest: "rst",
  rb: "ruby",
  rbw: "ruby",
  rake_ruby: "ruby",
  rakefile: "ruby",
  gemspec: "ruby",
  rs: "rust",
  rlib: "rust",
  // S
  sac: "sac",
  sass: "sass",
  scad: "scad",
  scala: "scala",
  sc: "scala",
  scheme: "scheme",
  ss_scheme: "scheme",
  scrypt: "scrypt",
  scss: "scss",
  sh: "sh",
  bash: "sh",
  zsh: "sh",
  bashrc: "sh",
  zshrc: "sh",
  ksh: "sh",
  sjs: "sjs",
  slim: "slim",
  smarty: "smarty",
  tpl_smarty: "smarty",
  smithy: "smithy",
  snippets: "snippets",
  snippet: "snippets",
  soy: "soy_template",
  space: "space",
  sparql: "sparql",
  rq: "sparql",
  sql: "sql",
  sqlserver: "sqlserver",
  tsql: "sqlserver",
  styl: "stylus",
  stylus: "stylus",
  svg: "svg",
  swift: "swift",
  // T
  tcl: "tcl",
  tf: "terraform",
  tfvars: "terraform",
  hcl: "terraform",
  tex: "tex",
  text_txt: "text",
  textile: "textile",
  toml: "toml",
  tsv: "tsv",
  tsx: "tsx",
  ttl: "turtle",
  turtle: "turtle",
  twig: "twig",
  ts: "typescript",
  // V
  vala: "vala",
  vapi: "vala",
  vbs: "vbscript",
  vb_vbs: "vbscript",
  vm: "velocity",
  velocity: "velocity",
  v: "verilog",
  vh: "verilog",
  sv: "verilog",
  svh: "verilog",
  vhd: "vhdl",
  vhdl: "vhdl",
  page: "visualforce",
  component: "visualforce",
  vue: "vue",
  // W
  wlk: "wollok",
  wpgm: "wollok",
  wtest: "wollok",
  // X
  xml: "xml",
  xsl: "xml",
  xsd: "xml",
  rss: "xml",
  atom: "xml",
  rdf: "xml",
  xul: "xml",
  xq: "xquery",
  xqy: "xquery",
  // Y
  yaml: "yaml",
  yml: "yaml",
  // Z
  zeek: "zeek",
  bro: "zeek",
  zig: "zig",
};

// Get language from file extension
function getLanguageFromExtension(extension: string): Language {
  const normalizedExtension = extension.toLowerCase().replace(/^\./, "");
  return extensionToLanguage[normalizedExtension] || "text";
}

// Utility function to combine class names
function cn(...classes: (string | undefined | false)[]) {
  return classes.filter(Boolean).join(" ");
}

/**
 * Code editor component with syntax highlighting
 *
 * @element ecc-utils-design-code
 */
export class EccUtilsDesignCode extends LitElement {
  static styles = [
    css`
      ${TailwindStyles}
    `,
    css`
      ${GlobalStyles}
    `,
    css`
      :host {
        display: block;
        width: 100%;
        height: 100%;
      }

      #editor {
        height: 100%;
        width: 100%;
        min-height: 300px;
      }
    `,
  ];

  @property({ type: String }) value = "";
  @property({ type: String }) language: Language = "text";
  @property({ type: String }) extension = "";
  @property({ type: Boolean }) disabled = false;

  @state() editor: any;

  firstUpdated() {
    this.initializeAceEditor();
    this.setupThemeObserver();
  }

  // Set language based on extension if provided
  connectedCallback() {
    super.connectedCallback();
    if (this.extension && !this.language) {
      this.language = getLanguageFromExtension(this.extension);
    }
  }

  setupThemeObserver() {
    // Set up mutation observer to watch for theme changes
    const observer = new MutationObserver(() => {
      this.updateEditorTheme();
    });

    // Observe changes to the document element and body
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["class"],
    });

    observer.observe(document.body, {
      attributes: true,
      attributeFilter: ["class"],
    });
  }

  isDarkMode() {
    return (
      document.documentElement.classList.contains("dark") ||
      document.body.classList.contains("dark") ||
      this.matches(":host-context(.dark)") ||
      this.matches(":host-context([dark])")
    );
  }

  updateEditorTheme() {
    if (this.editor) {
      const theme = this.isDarkMode()
        ? "ace/theme/cloud9_night"
        : "ace/theme/cloud9_day";
      this.editor.setTheme(theme);
    }
  }

  async initializeAceEditor() {
    const editorElement = this.shadowRoot?.getElementById("editor");
    if (editorElement) {
      const { ace } = window as any;
      ace.config.set(
        "workerPath",
        `https://cdn.jsdelivr.net/npm/ace-builds@${ace.version}/src-min-noconflict`
      );
      this.editor = ace.edit(editorElement);

      // Set initial theme based on current mode
      this.updateEditorTheme();

      this.editor.session.setUseWorker(true);
      this.editor.renderer.attachToShadowRoot();
      this.editor.setValue(this.value);

      // Clear selection after setting value
      this.editor.clearSelection();

      this.setEditorLanguage(this.language);
      if (this.disabled) this.editor.setReadOnly(true);

      this.editor.on("change", () => {
        this.value = this.editor.getValue();

        this.dispatchEvent(
          new CustomEvent("ecc-input-changed", {
            detail: { value: this.value },
            bubbles: true,
            composed: true,
          })
        );
      });
    }
  }

  async setEditorLanguage(language: Language) {
    if (!this.editor) return;

    try {
      // Directly set the mode without dynamic import
      this.editor.session.setMode(`ace/mode/${language}`);
    } catch (error) {
      console.error(
        `Failed to set mode for ${language}, falling back to text mode`,
        error
      );
      this.editor.session.setMode("ace/mode/text");
    }
  }

  updated(changedProperties: Map<string, any>) {
    if (changedProperties.has("language") && this.editor) {
      this.setEditorLanguage(this.language);
    }
    if (
      changedProperties.has("extension") &&
      this.editor &&
      !changedProperties.has("language")
    ) {
      const newLanguage = getLanguageFromExtension(this.extension);
      if (newLanguage !== this.language) {
        this.language = newLanguage;
        this.setEditorLanguage(this.language);
      }
    }
    if (changedProperties.has("disabled") && this.editor) {
      this.editor.setReadOnly(this.disabled);
    }
    if (
      changedProperties.has("value") &&
      this.editor &&
      this.value !== this.editor.getValue()
    ) {
      this.editor.setValue(this.value, -1); // -1 moves cursor to beginning
    }
  }

  render() {
    const containerClasses = cn(
      "rounded-md border border-input bg-background overflow-hidden h-full"
    );

    const editorClasses = cn(
      "h-full font-mono text-sm",
      this.disabled ? "opacity-70 cursor-not-allowed" : ""
    );

    return html`
      <div part="base" class=${containerClasses}>
        <div class="h-full relative">
          <div id="editor" class=${editorClasses}></div>
        </div>
      </div>
    `;
  }
}

export default EccUtilsDesignCode;
