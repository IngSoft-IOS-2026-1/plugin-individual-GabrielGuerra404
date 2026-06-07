"use strict";
var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  // If the importer is in node compatibility mode or this is not an ESM
  // file that has been converted to a CommonJS file using a Babel-
  // compatible transform (i.e. "__esModule" has not been set), then set
  // "default" to the CommonJS "module.exports" for node compatibility.
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// src/extension.ts
var extension_exports = {};
__export(extension_exports, {
  activate: () => activate,
  deactivate: () => deactivate
});
module.exports = __toCommonJS(extension_exports);
var vscode3 = __toESM(require("vscode"));

// src/commands.ts
var vscode2 = __toESM(require("vscode"));

// src/mirandaLinter.ts
var vscode = __toESM(require("vscode"));
var fs = __toESM(require("fs"));
var path = __toESM(require("path"));

// src/rules/BadIdentationRule.ts
var badIndentationRule = {
  name: "bad-identation",
  check(code, config) {
    const issues = [];
    const expectedSpaces = config?.indentationSpaces || 4;
    const lines = code.split("\n");
    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];
      if (line.trim().length === 0) {
        continue;
      }
      const leadingSpaces = line.match(/^ */)?.[0].length || 0;
      if (leadingSpaces > 0 && leadingSpaces % expectedSpaces !== 0) {
        issues.push({
          rule: "bad-identation",
          message: `Indentaci\xF3n incorrecta. Se esperaban m\xFAltiplos de ${expectedSpaces} espacios, se encontraron ${leadingSpaces}`,
          line: i + 1,
          column: leadingSpaces,
          severity: "warning"
        });
      }
    }
    return issues;
  }
};

// src/rules/UnbalancedParenthesesRule.ts
var unbalancedParenthesesRule = {
  name: "unbalanced-parentheses",
  check(code, config) {
    const issues = [];
    const lines = code.split("\n");
    const stack = [];
    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];
      for (let j = 0; j < line.length; j++) {
        const char = line[j];
        if (char === "(") {
          stack.push({ line: i + 1, column: j + 1 });
        } else if (char === ")") {
          if (stack.length === 0) {
            issues.push({
              rule: "unbalanced-parentheses",
              message: `Par\xE9ntesis de cierre ')' sin apertura correspondiente.`,
              line: i + 1,
              column: j + 1,
              severity: "error"
            });
          } else {
            stack.pop();
          }
        }
      }
    }
    for (const unclosed of stack) {
      issues.push({
        rule: "unbalanced-parentheses",
        message: `Par\xE9ntesis de apertura '(' sin cierre correspondiente. Abierto en l\xEDnea ${unclosed.line}, columna ${unclosed.column}.`,
        line: unclosed.line,
        column: unclosed.column,
        severity: "error"
      });
    }
    return issues;
  }
};

// src/rules/UnclosedDelimitersRule.ts
var unclosedDelimitersRule = {
  name: "unclosed-delimiters",
  check(code, config) {
    const issues = [];
    const lines = code.split("\n");
    const stack = [];
    const delimiters = {
      "[": "]",
      "{": "}"
    };
    const closingDelimiters = {
      "]": "[",
      "}": "{"
    };
    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];
      for (let j = 0; j < line.length; j++) {
        const char = line[j];
        if (char === "[" || char === "{") {
          stack.push({ type: char, line: i + 1, column: j + 1 });
        } else if (char === "]" || char === "}") {
          if (stack.length === 0) {
            issues.push({
              rule: "unclosed-delimiters",
              message: `Delimitador de cierre '${char}' sin apertura correspondiente.`,
              line: i + 1,
              column: j + 1,
              severity: "error"
            });
          } else {
            const last = stack[stack.length - 1];
            const expectedClosing = delimiters[last.type];
            if (char === expectedClosing) {
              stack.pop();
            } else {
              issues.push({
                rule: "unclosed-delimiters",
                message: `Delimitador incorrecto. Se esperaba '${expectedClosing}' pero se encontr\xF3 '${char}'. Delimitador de apertura '${last.type}' en l\xEDnea ${last.line}, columna ${last.column}.`,
                line: i + 1,
                column: j + 1,
                severity: "error"
              });
            }
          }
        }
      }
    }
    for (const unclosed of stack) {
      const closing = delimiters[unclosed.type];
      issues.push({
        rule: "unclosed-delimiters",
        message: `Delimitador de apertura '${unclosed.type}' sin cierre correspondiente. Se esperaba '${closing}'. Abierto en l\xEDnea ${unclosed.line}, columna ${unclosed.column}.`,
        line: unclosed.line,
        column: unclosed.column,
        severity: "error"
      });
    }
    return issues;
  }
};

// src/rules/IncompleteDefinitionRule.ts
var incompleteDefinitionRule = {
  name: "incomplete-definition",
  check(code, config) {
    const issues = [];
    const lines = code.split("\n");
    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];
      const trimmedLine = line.trim();
      if (!trimmedLine || trimmedLine.startsWith("//")) {
        continue;
      }
      const leadingSpaces = line.match(/^ */)?.[0].length || 0;
      if (leadingSpaces > 0) {
        continue;
      }
      const equalsIndex = trimmedLine.indexOf("=");
      if (equalsIndex !== -1) {
        const afterEquals = trimmedLine.substring(equalsIndex + 1).trim();
        if (afterEquals.length === 0) {
          const nextLineSpaces = (lines[i + 1]?.match(/^ */) ?? [])[0]?.length ?? 0;
          const hasIndentedContinuation = i + 1 < lines.length && lines[i + 1].trim().length > 0 && nextLineSpaces > 0;
          if (!hasIndentedContinuation) {
            const functionMatch = trimmedLine.match(/^([a-zA-Z_]\w*)\s+/);
            const functionName = functionMatch ? functionMatch[1] : "funci\xF3n";
            issues.push({
              rule: "incomplete-definition",
              message: `Definici\xF3n incompleta de '${functionName}'. Falta la expresi\xF3n despu\xE9s del '='.`,
              line: i + 1,
              column: equalsIndex + 1,
              severity: "error"
            });
          }
        }
      }
    }
    return issues;
  }
};

// src/rules/DuplicateDefinitionRule.ts
var duplicateDefinitionRule = {
  name: "duplicate-definition",
  check(code, config) {
    const issues = [];
    const definedPatterns = /* @__PURE__ */ new Map();
    const lines = code.split("\n");
    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];
      const trimmedLine = line.trim();
      if (!trimmedLine || trimmedLine.startsWith("//")) {
        continue;
      }
      const leadingSpaces = line.match(/^ */)?.[0].length || 0;
      if (leadingSpaces > 0) {
        continue;
      }
      const equalsIndex = trimmedLine.indexOf("=");
      if (equalsIndex !== -1) {
        const pattern = trimmedLine.substring(0, equalsIndex).trim();
        if (/^[a-zA-Z_]\w*/.test(pattern)) {
          if (!definedPatterns.has(pattern)) {
            definedPatterns.set(pattern, [i + 1]);
          } else {
            definedPatterns.get(pattern).push(i + 1);
          }
        }
      }
    }
    for (const [pattern, lineNumbers] of definedPatterns.entries()) {
      if (lineNumbers.length > 1) {
        for (let j = 1; j < lineNumbers.length; j++) {
          issues.push({
            rule: "duplicate-definition",
            message: `Definici\xF3n duplicada del patr\xF3n '${pattern}'. Primera definici\xF3n en l\xEDnea ${lineNumbers[0]}.`,
            line: lineNumbers[j],
            column: 0,
            severity: "error"
          });
        }
      }
    }
    return issues;
  }
};

// src/rules/UndefinedVariableRule.ts
var RESERVED_KEYWORDS = /* @__PURE__ */ new Set([
  "if",
  "then",
  "else",
  "where",
  "let",
  "in",
  "otherwise",
  "and",
  "or",
  "not",
  "div",
  "mod",
  "rem",
  "abs",
  "min",
  "max"
]);
var BUILTIN_FUNCTIONS = /* @__PURE__ */ new Set([
  "abs",
  "sign",
  "min",
  "max",
  "gcd",
  "lcm",
  "length",
  "head",
  "tail",
  "reverse",
  "sort",
  "append",
  "take",
  "drop",
  "map",
  "filter",
  "foldl",
  "foldr",
  "zip",
  "unzip",
  "strlen",
  "substr",
  "concat",
  "chars",
  "ord",
  "chr",
  "print",
  "println",
  "read",
  "readln",
  "show",
  "hd",
  "tl",
  "null",
  "not",
  "even",
  "odd",
  "isalpha",
  "isdigit",
  "compose",
  "flip",
  "curry",
  "uncurry",
  "div",
  "mod",
  "rem",
  "pow",
  "sqrt",
  "exp",
  "log",
  "sin",
  "cos",
  "tan",
  "id",
  "const",
  "fst",
  "snd",
  "error",
  "undefined"
]);
var undefinedVariableRule = {
  name: "undefined-variable",
  check(code, config) {
    const issues = [];
    const lines = code.split("\n");
    const definedFunctions = /* @__PURE__ */ new Set();
    for (const line of lines) {
      const trimmed = line.trim();
      if (!trimmed || trimmed.startsWith("//")) {
        continue;
      }
      if (line.match(/^ /)) {
        continue;
      }
      const defMatch = trimmed.match(/^([a-zA-Z_]\w*)\s*/);
      if (defMatch && trimmed.includes("=")) {
        definedFunctions.add(defMatch[1]);
      }
    }
    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];
      const trimmed = line.trim();
      if (!trimmed || trimmed.startsWith("//")) {
        continue;
      }
      const definitionMatch = trimmed.match(/^([a-zA-Z_]\w*)\s+(.*?)\s*=\s*(.*)/);
      if (definitionMatch) {
        const functionName = definitionMatch[1];
        const paramsString = definitionMatch[2];
        const expression = definitionMatch[3];
        const parameters = /* @__PURE__ */ new Set();
        parameters.add(functionName);
        const paramTokens = paramsString.split(/\s+/).filter((p) => p.length > 0);
        for (const param of paramTokens) {
          if (/^[a-zA-Z_]\w*$/.test(param)) {
            parameters.add(param);
          }
        }
        const identifierRegex = /\b([a-zA-Z_]\w*)\b/g;
        let match;
        const reportedInLine = /* @__PURE__ */ new Set();
        while ((match = identifierRegex.exec(expression)) !== null) {
          const identifier = match[1];
          if (reportedInLine.has(identifier)) {
            continue;
          }
          if (RESERVED_KEYWORDS.has(identifier)) {
            continue;
          }
          if (parameters.has(identifier)) {
            continue;
          }
          if (definedFunctions.has(identifier)) {
            continue;
          }
          if (BUILTIN_FUNCTIONS.has(identifier)) {
            continue;
          }
          if (/^\d+$/.test(identifier)) {
            continue;
          }
          const columnNumber = line.indexOf(identifier) + 1;
          issues.push({
            rule: "undefined-variable",
            message: `Variable no definida '${identifier}'. Debe ser un par\xE1metro o estar definida en 'where'.`,
            line: i + 1,
            column: columnNumber,
            severity: "error"
          });
          reportedInLine.add(identifier);
        }
      }
    }
    return issues;
  }
};

// src/rules/UndefinedFunctionRule.ts
var BUILTIN_FUNCTIONS2 = /* @__PURE__ */ new Set([
  // Funciones aritméticas
  "abs",
  "sign",
  "min",
  "max",
  "gcd",
  "lcm",
  // Funciones de listas
  "length",
  "head",
  "tail",
  "reverse",
  "sort",
  "append",
  "take",
  "drop",
  "map",
  "filter",
  "foldl",
  "foldr",
  "zip",
  "unzip",
  // Funciones de strings
  "strlen",
  "substr",
  "concat",
  "chars",
  "ord",
  "chr",
  // Funciones de entrada/salida
  "print",
  "println",
  "read",
  "readln",
  "show",
  "hd",
  "tl",
  // Funciones de tipo
  "null",
  "not",
  "even",
  "odd",
  "isalpha",
  "isdigit",
  // Funciones de orden superior
  "compose",
  "flip",
  "curry",
  "uncurry",
  // Operadores comunes representados como funciones
  "div",
  "mod",
  "rem",
  "pow",
  "sqrt",
  "exp",
  "log",
  "sin",
  "cos",
  "tan",
  // Más funciones built-in
  "id",
  "const",
  "fst",
  "snd",
  "error",
  "undefined"
]);
var undefinedFunctionRule = {
  name: "undefined-function",
  check(code, config) {
    const issues = [];
    const lines = code.split("\n");
    const definedFunctions = /* @__PURE__ */ new Set();
    for (const line of lines) {
      const trimmed = line.trim();
      if (!trimmed || trimmed.startsWith("//")) {
        continue;
      }
      if (line.match(/^ /)) {
        continue;
      }
      const definitionMatch = trimmed.match(/^([a-zA-Z_]\w*)\s*/);
      if (definitionMatch && trimmed.includes("=")) {
        definedFunctions.add(definitionMatch[1]);
      }
    }
    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];
      const trimmed = line.trim();
      if (!trimmed || trimmed.startsWith("//")) {
        continue;
      }
      const identifierRegex = /\b([a-zA-Z_]\w*)\b/g;
      let match;
      while ((match = identifierRegex.exec(trimmed)) !== null) {
        const identifier = match[1];
        const position = match.index;
        if (["if", "then", "else", "where", "let", "in", "otherwise"].includes(identifier)) {
          continue;
        }
        if (["and", "or", "not", "div", "mod", "rem"].includes(identifier)) {
          continue;
        }
        const beforeIdentifier = trimmed.substring(0, position);
        if (beforeIdentifier.includes("=")) {
        } else {
          continue;
        }
        if (!definedFunctions.has(identifier) && !BUILTIN_FUNCTIONS2.has(identifier)) {
          const defMatch = trimmed.match(/^([a-zA-Z_]\w*)\s+([a-zA-Z_]\w*[\s\w]*)\s*=/);
          if (defMatch) {
            const params = defMatch[2].split(/\s+/);
            if (params.includes(identifier)) {
              continue;
            }
          }
          const columnNumber = line.indexOf(identifier) + 1;
          issues.push({
            rule: "undefined-function",
            message: `Funci\xF3n no definida '${identifier}'.`,
            line: i + 1,
            column: columnNumber,
            severity: "error"
          });
        }
      }
    }
    return issues;
  }
};

// src/mirandaLinter.ts
var mirandaRules = [
  badIndentationRule,
  unbalancedParenthesesRule,
  unclosedDelimitersRule,
  incompleteDefinitionRule,
  duplicateDefinitionRule,
  undefinedVariableRule,
  undefinedFunctionRule
];
function loadConfig() {
  try {
    const workspaceFolder = vscode.workspace.workspaceFolders?.[0]?.uri.fsPath;
    if (!workspaceFolder) {
      throw new Error("No workspace folder found");
    }
    const configPath = path.join(workspaceFolder, "miralinter.config.json");
    if (!fs.existsSync(configPath)) {
      return getDefaultConfig();
    }
    const configContent = fs.readFileSync(configPath, "utf-8");
    return JSON.parse(configContent);
  } catch (error) {
    return getDefaultConfig();
  }
}
function getDefaultConfig() {
  return {
    rules: {
      "bad-identation": { enabled: true, indentationSpaces: 4 },
      "unbalanced-parentheses": { enabled: true },
      "unclosed-delimiters": { enabled: true },
      "incomplete-definition": { enabled: true },
      "duplicate-definition": { enabled: true },
      "undefined-variable": { enabled: true },
      "undefined-function": { enabled: true }
    }
  };
}
function lintMirandaCode(code) {
  const config = loadConfig();
  const passed = [];
  const failed = [];
  for (const rule of mirandaRules) {
    const ruleConfig = config.rules[rule.name];
    if (ruleConfig && !ruleConfig.enabled) {
      continue;
    }
    const issues = rule.check(code, ruleConfig);
    if (issues.length === 0) {
      passed.push(rule.name);
    } else {
      failed.push(...issues);
    }
  }
  console.log("Problemas encontrados:", failed);
  return {
    passed,
    failed
  };
}
function showLintResults(results) {
  const passedText = results.passed.length > 0 ? results.passed.join("\n") : "Ninguna";
  const failedText = results.failed.length > 0 ? results.failed.map(
    (issue) => `[L${issue.line}] ${issue.message}`
  ).join("\n") : "Ninguna";
  vscode.window.showInformationMessage(
    `Resultados del Linting Miranda:

\u2713 Reglas cumplidas:
${passedText}

\u2717 Problemas encontrados:
${failedText}`
  );
}

// src/commands.ts
function registerLintCommand(context) {
  const disposable = vscode2.commands.registerCommand("miralinter.lintCode", () => {
    const editor = vscode2.window.activeTextEditor;
    if (!editor) {
      vscode2.window.showErrorMessage("No hay un archivo abierto para analizar");
      return;
    }
    const code = editor.document.getText();
    const results = lintMirandaCode(code);
    showLintResults(results);
  });
  context.subscriptions.push(disposable);
}

// src/extension.ts
function activate(context) {
  console.log('Congratulations, your extension "miralinter" is now active!');
  registerLintCommand(context);
  const disposable = vscode3.commands.registerCommand("miralinter.helloWorld", () => {
    vscode3.window.showInformationMessage("Hello World from Simple Miranda ESLint!");
  });
  context.subscriptions.push(disposable);
}
function deactivate() {
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  activate,
  deactivate
});
//# sourceMappingURL=extension.js.map
