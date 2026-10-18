// Диагностика WebGL на телефоне: страница diag.html стенда (tools/publish_stand.py)
// грузит этот файл раньше игры. Поверх игры — текст: видеокарта и её пределы,
// ошибки компиляции и сборки шейдеров, ошибки вызовов отрисовки (с шейдером и
// блоками uniform), console.error/warn. Основатель присылает скриншот.
(function () {
  var lines = [];
  var seen = {};
  var box = null;

  function add(key, text) {
    if (seen[key]) { seen[key].n++; return; }
    seen[key] = { n: 1, i: lines.length };
    lines.push(text);
    if (lines.length > 40) lines.splice(5, 1);
  }

  function render() {
    if (!document.body) return;
    if (!box) {
      box = document.createElement("div");
      box.style.cssText = "position:fixed;left:0;top:0;right:0;max-height:62vh;overflow:hidden;z-index:99;" +
        "pointer-events:none;background:rgba(0,0,0,.72);color:#fff;font:10px/1.25 monospace;" +
        "padding:4px 6px;white-space:pre-wrap;word-break:break-all";
      document.body.appendChild(box);
    }
    var out = [];
    for (var i = 0; i < lines.length; i++) {
      var key = Object.keys(seen).filter(function (k) { return seen[k].i === i; })[0];
      var n = key && seen[key].n > 1 ? " ×" + seen[key].n : "";
      out.push(lines[i] + n);
    }
    box.textContent = out.join("\n");
  }
  setInterval(render, 1000);

  function label(gl, program) {
    try {
      var shaders = gl.getAttachedShaders(program) || [];
      for (var i = 0; i < shaders.length; i++) {
        var src = gl.getShaderSource(shaders[i]) || "";
        if ((src.indexOf("_CrowdInst") >= 0 || src.indexOf("_CrowdData") >= 0)) {
          var rigid = src.indexOf("_BoneTex") < 0 ? "rigid" : "skin";
          var pass = src.indexOf("_CrowdSHAr") >= 0 ? "forward" : src.indexOf("_ShadowBias") >= 0 ? "shadow" : "outline/depth";
          return "crowd-" + rigid + "-" + pass;
        }
      }
      var s = shaders.length ? (gl.getShaderSource(shaders[0]) || "") : "";
      var m = s.match(/uniform\s+\w+\s+\w+\s+(_\w+)/);
      return "prog(" + (m ? m[1] : "?") + ")";
    } catch (e) { return "prog(?)"; }
  }

  // Блоки uniform программы: размер блока против размера буфера на его
  // привязке — частая причина INVALID_OPERATION у инстансинга.
  function blocks(gl, program) {
    var out = [];
    try {
      var n = gl.getProgramParameter(program, gl.ACTIVE_UNIFORM_BLOCKS);
      for (var i = 0; i < n; i++) {
        var name = gl.getActiveUniformBlockName(program, i);
        var size = gl.getActiveUniformBlockParameter(program, i, gl.UNIFORM_BLOCK_DATA_SIZE);
        var bind = gl.getActiveUniformBlockParameter(program, i, gl.UNIFORM_BLOCK_BINDING);
        var buf = gl.getIndexedParameter(gl.UNIFORM_BUFFER_BINDING, bind);
        var bsize = gl.getIndexedParameter(gl.UNIFORM_BUFFER_SIZE, bind);
        out.push(name + ":" + size + "/" + (buf ? bsize : "none"));
      }
    } catch (e) { out.push("blocks?" + e); }
    return out.join(" ");
  }

  var names = { 1280: "INVALID_ENUM", 1281: "INVALID_VALUE", 1282: "INVALID_OPERATION", 1285: "OUT_OF_MEMORY", 1286: "INVALID_FRAMEBUFFER_OP" };

  function hook(proto) {
    var compile = proto.compileShader;
    proto.compileShader = function (sh) {
      compile.call(this, sh);
      if (!this.getShaderParameter(sh, this.COMPILE_STATUS)) {
        var src = this.getShaderSource(sh) || "";
        add("c" + src.length, "SHADER FAIL: " + (this.getShaderInfoLog(sh) || "").slice(0, 300) +
          ((src.indexOf("_CrowdInst") >= 0 || src.indexOf("_CrowdData") >= 0) ? " [crowd]" : ""));
      }
    };
    var link = proto.linkProgram;
    proto.linkProgram = function (p) {
      link.call(this, p);
      if (!this.getProgramParameter(p, this.LINK_STATUS)) {
        add("l" + label(this, p), "LINK FAIL " + label(this, p) + ": " + (this.getProgramInfoLog(p) || "").slice(0, 300));
      }
    };
    ["drawElementsInstanced", "drawArraysInstanced", "drawElements", "drawArrays"].forEach(function (fn) {
      var orig = proto[fn];
      if (!orig) return;
      var count = 0;
      proto[fn] = function () {
        orig.apply(this, arguments);
        count++;
        var instanced = fn.indexOf("Instanced") > 0;
        if (!instanced && count % 25 !== 0) return;
        var err = this.getError();
        if (err) {
          var p = this.getParameter(this.CURRENT_PROGRAM);
          var l = p ? label(this, p) : "noprog";
          add("e" + fn + err + l, "DRAW ERR " + fn + " " + (names[err] || err) + " " + l +
            (instanced ? " n=" + arguments[arguments.length - 1] : "") + (p ? " | " + blocks(this, p) : ""));
        }
      };
    });
    var getContext = HTMLCanvasElement.prototype.getContext;
    HTMLCanvasElement.prototype.getContext = function (type) {
      var gl = getContext.apply(this, arguments);
      if (gl && type === "webgl2" && !this.__diag) {
        this.__diag = true;
        try {
          var d = gl.getExtension("WEBGL_debug_renderer_info");
          var hp = gl.getShaderPrecisionFormat(gl.FRAGMENT_SHADER, gl.HIGH_FLOAT);
          add("gpu", "GPU: " + (d ? gl.getParameter(d.UNMASKED_RENDERER_WEBGL) : gl.getParameter(gl.RENDERER)) +
            "\nUBO " + gl.getParameter(gl.MAX_UNIFORM_BLOCK_SIZE) +
            " vUni " + gl.getParameter(gl.MAX_VERTEX_UNIFORM_VECTORS) +
            " fUni " + gl.getParameter(gl.MAX_FRAGMENT_UNIFORM_VECTORS) +
            " vBlk " + gl.getParameter(gl.MAX_VERTEX_UNIFORM_BLOCKS) +
            " vary " + gl.getParameter(gl.MAX_VARYING_VECTORS) +
            " tex " + gl.getParameter(gl.MAX_TEXTURE_SIZE) +
            " vTex " + gl.getParameter(gl.MAX_VERTEX_TEXTURE_IMAGE_UNITS) +
            " fHigh " + (hp ? hp.precision : "?") +
            " cbf " + !!gl.getExtension("EXT_color_buffer_float") +
            " dpr " + (window.devicePixelRatio || 1));
        } catch (e) { add("gpu", "GPU info failed: " + e); }
      }
      return gl;
    };
  }
  if (window.WebGL2RenderingContext) hook(WebGL2RenderingContext.prototype);
  else add("nogl2", "NO WebGL2");

  ["error", "warn"].forEach(function (level) {
    var orig = console[level];
    console[level] = function () {
      var text = Array.prototype.join.call(arguments, " ");
      if (text.indexOf("AudioContext") < 0) add(level + text.slice(0, 80), level.toUpperCase() + ": " + text.slice(0, 240));
      return orig.apply(console, arguments);
    };
  });
  var log = console.log;
  console.log = function () {
    var text = Array.prototype.join.call(arguments, " ");
    if (/\[game7\].*(device|quality|look|meta=)/.test(text)) add("g" + text.slice(0, 60), text.slice(0, 240));
    return log.apply(console, arguments);
  };
  window.addEventListener("error", function (e) { add("x" + e.message, "JS: " + e.message); });
  add("hdr", "game7 diag — " + new Date().toISOString().slice(0, 16));
})();
