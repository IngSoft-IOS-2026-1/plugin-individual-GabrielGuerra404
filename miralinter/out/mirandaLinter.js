"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.lintMirandaCode = lintMirandaCode;
exports.showLintResults = showLintResults;
const vscode = __importStar(require("vscode"));
const fs = __importStar(require("fs"));
const path = __importStar(require("path"));
const BadIdentationRule_1 = require("./rules/BadIdentationRule");
const UnbalancedParenthesesRule_1 = require("./rules/UnbalancedParenthesesRule");
const UnclosedDelimitersRule_1 = require("./rules/UnclosedDelimitersRule");
const IncompleteDefinitionRule_1 = require("./rules/IncompleteDefinitionRule");
const DuplicateDefinitionRule_1 = require("./rules/DuplicateDefinitionRule");
const UndefinedVariableRule_1 = require("./rules/UndefinedVariableRule");
const UndefinedFunctionRule_1 = require("./rules/UndefinedFunctionRule");
const mirandaRules = [
    BadIdentationRule_1.badIndentationRule,
    UnbalancedParenthesesRule_1.unbalancedParenthesesRule,
    UnclosedDelimitersRule_1.unclosedDelimitersRule,
    IncompleteDefinitionRule_1.incompleteDefinitionRule,
    DuplicateDefinitionRule_1.duplicateDefinitionRule,
    UndefinedVariableRule_1.undefinedVariableRule,
    UndefinedFunctionRule_1.undefinedFunctionRule
];
/**
 * Carga la configuración del archivo miralinter.config.json
 */
function loadConfig() {
    try {
        const workspaceFolder = vscode.workspace.workspaceFolders?.[0]?.uri.fsPath;
        if (!workspaceFolder) {
            throw new Error('No workspace folder found');
        }
        const configPath = path.join(workspaceFolder, 'miralinter.config.json');
        if (!fs.existsSync(configPath)) {
            // Si no existe, retornar configuración por defecto con todas las reglas habilitadas
            return getDefaultConfig();
        }
        const configContent = fs.readFileSync(configPath, 'utf-8');
        return JSON.parse(configContent);
    }
    catch (error) {
        return getDefaultConfig();
    }
}
/**
 * Retorna la configuración por defecto
 */
function getDefaultConfig() {
    return {
        rules: {
            'bad-identation': { enabled: true, indentationSpaces: 4 },
            'unbalanced-parentheses': { enabled: true },
            'unclosed-delimiters': { enabled: true },
            'incomplete-definition': { enabled: true },
            'duplicate-definition': { enabled: true },
            'undefined-variable': { enabled: true },
            'undefined-function': { enabled: true }
        }
    };
}
function lintMirandaCode(code) {
    const config = loadConfig();
    const passed = [];
    const failed = [];
    for (const rule of mirandaRules) {
        // Obtener la configuración de la regla
        const ruleConfig = config.rules[rule.name];
        // Si la regla no está habilitada, saltarla
        if (ruleConfig && !ruleConfig.enabled) {
            continue;
        }
        const issues = rule.check(code, ruleConfig);
        if (issues.length === 0) {
            passed.push(rule.name);
        }
        else {
            failed.push(...issues);
        }
    }
    console.log('Problemas encontrados:', failed);
    return {
        passed,
        failed
    };
}
/**
 * Muestra los resultados del linting en un mensaje al usuario
 */
function showLintResults(results) {
    const passedText = results.passed.length > 0
        ? results.passed.join('\n')
        : 'Ninguna';
    const failedText = results.failed.length > 0
        ? results.failed
            .map(issue => `[L${issue.line}] ${issue.message}`)
            .join('\n')
        : 'Ninguna';
    vscode.window.showInformationMessage(`Resultados del Linting Miranda:\n\n` +
        `✓ Reglas cumplidas:\n${passedText}\n\n` +
        `✗ Problemas encontrados:\n${failedText}`);
}
//# sourceMappingURL=mirandaLinter.js.map