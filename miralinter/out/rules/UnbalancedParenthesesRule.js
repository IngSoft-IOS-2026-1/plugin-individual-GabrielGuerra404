"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.unbalancedParenthesesRule = void 0;
exports.unbalancedParenthesesRule = {
    name: 'unbalanced-parentheses',
    check(code, config) {
        const issues = [];
        const lines = code.split('\n');
        // Stack para mantener track de paréntesis abiertos
        // Guardamos la línea y columna de cada paréntesis de apertura
        const stack = [];
        for (let i = 0; i < lines.length; i++) {
            const line = lines[i];
            for (let j = 0; j < line.length; j++) {
                const char = line[j];
                if (char === '(') {
                    // Agregar paréntesis de apertura al stack
                    stack.push({ line: i + 1, column: j + 1 });
                }
                else if (char === ')') {
                    // Intentar cerrar un paréntesis
                    if (stack.length === 0) {
                        // Paréntesis de cierre sin apertura correspondiente
                        issues.push({
                            rule: 'unbalanced-parentheses',
                            message: `Paréntesis de cierre ')' sin apertura correspondiente.`,
                            line: i + 1,
                            column: j + 1,
                            severity: 'error'
                        });
                    }
                    else {
                        // Encontramos el par, removemos de stack
                        stack.pop();
                    }
                }
            }
        }
        // Si quedan paréntesis sin cerrar en el stack
        for (const unclosed of stack) {
            issues.push({
                rule: 'unbalanced-parentheses',
                message: `Paréntesis de apertura '(' sin cierre correspondiente. Abierto en línea ${unclosed.line}, columna ${unclosed.column}.`,
                line: unclosed.line,
                column: unclosed.column,
                severity: 'error'
            });
        }
        return issues;
    },
};
//# sourceMappingURL=UnbalancedParenthesesRule.js.map