"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.unclosedDelimitersRule = void 0;
exports.unclosedDelimitersRule = {
    name: 'unclosed-delimiters',
    check(code, config) {
        const issues = [];
        const lines = code.split('\n');
        // Stack para mantener track de delimitadores abiertos
        // Guardamos el tipo, línea y columna de cada delimitador de apertura
        const stack = [];
        // Mapeo de delimitadores de apertura a cierre
        const delimiters = {
            '[': ']',
            '{': '}'
        };
        const closingDelimiters = {
            ']': '[',
            '}': '{'
        };
        for (let i = 0; i < lines.length; i++) {
            const line = lines[i];
            for (let j = 0; j < line.length; j++) {
                const char = line[j];
                // Delimitador de apertura
                if (char === '[' || char === '{') {
                    stack.push({ type: char, line: i + 1, column: j + 1 });
                }
                // Delimitador de cierre
                else if (char === ']' || char === '}') {
                    if (stack.length === 0) {
                        // Delimitador de cierre sin apertura correspondiente
                        issues.push({
                            rule: 'unclosed-delimiters',
                            message: `Delimitador de cierre '${char}' sin apertura correspondiente.`,
                            line: i + 1,
                            column: j + 1,
                            severity: 'error'
                        });
                    }
                    else {
                        const last = stack[stack.length - 1];
                        const expectedClosing = delimiters[last.type];
                        if (char === expectedClosing) {
                            // Delimitador coincide correctamente
                            stack.pop();
                        }
                        else {
                            // Delimitador de cierre incorrecto
                            issues.push({
                                rule: 'unclosed-delimiters',
                                message: `Delimitador incorrecto. Se esperaba '${expectedClosing}' pero se encontró '${char}'. Delimitador de apertura '${last.type}' en línea ${last.line}, columna ${last.column}.`,
                                line: i + 1,
                                column: j + 1,
                                severity: 'error'
                            });
                            // No removemos del stack, continuamos verificando
                        }
                    }
                }
            }
        }
        // Si quedan delimitadores sin cerrar en el stack
        for (const unclosed of stack) {
            const closing = delimiters[unclosed.type];
            issues.push({
                rule: 'unclosed-delimiters',
                message: `Delimitador de apertura '${unclosed.type}' sin cierre correspondiente. Se esperaba '${closing}'. Abierto en línea ${unclosed.line}, columna ${unclosed.column}.`,
                line: unclosed.line,
                column: unclosed.column,
                severity: 'error'
            });
        }
        return issues;
    },
};
//# sourceMappingURL=UnclosedDelimitersRule.js.map