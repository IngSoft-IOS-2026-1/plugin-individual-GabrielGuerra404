import * as vscode from 'vscode';
import * as fs from 'fs';
import * as path from 'path';

import { LintIssue } from './types/LintIssue';
import { LintResults } from './types/LintResults';
import { LintRule } from './types/LintRule';
import { LintConfig } from './types/LintConfig';
import { badIndentationRule } from './rules/BadIdentationRule';
import { unbalancedParenthesesRule } from './rules/UnbalancedParenthesesRule';
import { unclosedDelimitersRule } from './rules/UnclosedDelimitersRule';
import { incompleteDefinitionRule } from './rules/IncompleteDefinitionRule';
import { duplicateDefinitionRule } from './rules/DuplicateDefinitionRule';
import { undefinedVariableRule } from './rules/UndefinedVariableRule';
import { undefinedFunctionRule } from './rules/UndefinedFunctionRule';

const mirandaRules: LintRule[] = [
    badIndentationRule,
    unbalancedParenthesesRule,
    unclosedDelimitersRule,
    incompleteDefinitionRule,
    duplicateDefinitionRule,
    undefinedVariableRule,
    undefinedFunctionRule
];

/**
 * Carga la configuración del archivo miralinter.config.json
 */
function loadConfig(): LintConfig {
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
        return JSON.parse(configContent) as LintConfig;
    } catch (error) {
        return getDefaultConfig();
    }
}

/**
 * Retorna la configuración por defecto
 */
function getDefaultConfig(): LintConfig {
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

export function lintMirandaCode(code: string): LintResults {
    const config = loadConfig();
    const passed: string[] = [];
    const failed: LintIssue[] = [];

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
        } else {
            failed.push(...issues);
        }
    }

    //console.log('Problemas encontrados:', failed);

    return {
        passed,
        failed
    };
}

/**
 * Muestra los resultados del linting en un mensaje al usuario
 */
export function showLintResults(results: LintResults): void {

    const passedText =
        results.passed.length > 0
            ? results.passed.join('\n')
            : 'Ninguna';

    const failedText =
        results.failed.length > 0
            ? results.failed
                .map(issue =>
                    `[L${issue.line}] ${issue.message}`
                )
                .join('\n')
            : 'Ninguna';

    vscode.window.showInformationMessage(
        `Resultados del Linting Miranda:\n\n` +
        `✓ Reglas cumplidas:\n${passedText}\n\n` +
        `✗ Problemas encontrados:\n${failedText}`
    );
}
