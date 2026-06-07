"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.undefinedVariableRule = void 0;
// Palabras clave reservadas en Miranda
const RESERVED_KEYWORDS = new Set([
    'if', 'then', 'else', 'where', 'let', 'in', 'otherwise',
    'and', 'or', 'not', 'div', 'mod', 'rem', 'abs', 'min', 'max'
]);
// Funciones built-in comunes en Miranda
const BUILTIN_FUNCTIONS = new Set([
    'abs', 'sign', 'min', 'max', 'gcd', 'lcm',
    'length', 'head', 'tail', 'reverse', 'sort', 'append', 'take', 'drop',
    'map', 'filter', 'foldl', 'foldr', 'zip', 'unzip',
    'strlen', 'substr', 'concat', 'chars', 'ord', 'chr',
    'print', 'println', 'read', 'readln', 'show', 'hd', 'tl',
    'null', 'not', 'even', 'odd', 'isalpha', 'isdigit',
    'compose', 'flip', 'curry', 'uncurry',
    'div', 'mod', 'rem', 'pow', 'sqrt', 'exp', 'log', 'sin', 'cos', 'tan',
    'id', 'const', 'fst', 'snd', 'error', 'undefined'
]);
exports.undefinedVariableRule = {
    name: 'undefined-variable',
    check(code, config) {
        const issues = [];
        const lines = code.split('\n');
        // Recolectar todas las funciones definidas en el código
        const definedFunctions = new Set();
        for (const line of lines) {
            const trimmed = line.trim();
            if (!trimmed || trimmed.startsWith('//')) {
                continue;
            }
            if (line.match(/^ /)) {
                continue;
            }
            const defMatch = trimmed.match(/^([a-zA-Z_]\w*)\s*/);
            if (defMatch && trimmed.includes('=')) {
                definedFunctions.add(defMatch[1]);
            }
        }
        for (let i = 0; i < lines.length; i++) {
            const line = lines[i];
            const trimmed = line.trim();
            // Saltar líneas vacías y comentarios
            if (!trimmed || trimmed.startsWith('//')) {
                continue;
            }
            // Buscar definiciones de funciones: "nombre args = expresión"
            const definitionMatch = trimmed.match(/^([a-zA-Z_]\w*)\s+(.*?)\s*=\s*(.*)/);
            if (definitionMatch) {
                const functionName = definitionMatch[1];
                const paramsString = definitionMatch[2];
                const expression = definitionMatch[3];
                // Extraer parámetros de la definición
                const parameters = new Set();
                // Agregar el nombre de la función como definido
                parameters.add(functionName);
                // Agregar los parámetros
                const paramTokens = paramsString.split(/\s+/).filter(p => p.length > 0);
                for (const param of paramTokens) {
                    // Solo agregar identificadores válidos (sin caracteres especiales)
                    if (/^[a-zA-Z_]\w*$/.test(param)) {
                        parameters.add(param);
                    }
                }
                // Buscar identificadores en la expresión
                const identifierRegex = /\b([a-zA-Z_]\w*)\b/g;
                let match;
                const reportedInLine = new Set(); // Para evitar duplicados en la misma línea
                while ((match = identifierRegex.exec(expression)) !== null) {
                    const identifier = match[1];
                    // Saltar si ya reportamos este identificador en esta línea
                    if (reportedInLine.has(identifier)) {
                        continue;
                    }
                    // Saltar palabras reservadas
                    if (RESERVED_KEYWORDS.has(identifier)) {
                        continue;
                    }
                    // Saltar si es un parámetro
                    if (parameters.has(identifier)) {
                        continue;
                    }
                    // Saltar si es una función definida
                    if (definedFunctions.has(identifier)) {
                        continue;
                    }
                    // Saltar si es una función built-in
                    if (BUILTIN_FUNCTIONS.has(identifier)) {
                        continue;
                    }
                    // Saltar si es un número (literal)
                    if (/^\d+$/.test(identifier)) {
                        continue;
                    }
                    // Si no está en los parámetros, es variable indefinida
                    const columnNumber = line.indexOf(identifier) + 1;
                    issues.push({
                        rule: 'undefined-variable',
                        message: `Variable no definida '${identifier}'. Debe ser un parámetro o estar definida en 'where'.`,
                        line: i + 1,
                        column: columnNumber,
                        severity: 'error'
                    });
                    reportedInLine.add(identifier);
                }
            }
        }
        return issues;
    },
};
//# sourceMappingURL=UndefinedVariableRule.js.map