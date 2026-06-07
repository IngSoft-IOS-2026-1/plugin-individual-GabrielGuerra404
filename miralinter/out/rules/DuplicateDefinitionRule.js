"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.duplicateDefinitionRule = void 0;
exports.duplicateDefinitionRule = {
    name: 'duplicate-definition',
    check(code, config) {
        const issues = [];
        const definedFunctions = new Map();
        const lines = code.split('\n');
        for (let i = 0; i < lines.length; i++) {
            const line = lines[i];
            const trimmedLine = line.trim();
            // Saltar líneas vacías y comentarios
            if (!trimmedLine || trimmedLine.startsWith('//')) {
                continue;
            }
            // Solo procesar líneas que no estén indentadas (definiciones de nivel superior)
            // Las líneas indentadas son continuaciones de definiciones anteriores
            const leadingSpaces = line.match(/^ */)?.[0].length || 0;
            if (leadingSpaces > 0) {
                continue;
            }
            // Detectar patrón de definición en Miranda: "nombre args = ..."
            // El nombre debe ser un identificador válido (inicia con letra o _)
            const definitionMatch = trimmedLine.match(/^([a-zA-Z_]\w*)\s+/);
            // Verificar que contiene el símbolo '=' para confirmar que es una definición
            if (definitionMatch && trimmedLine.includes('=')) {
                const functionName = definitionMatch[1];
                if (!definedFunctions.has(functionName)) {
                    definedFunctions.set(functionName, [i + 1]);
                }
                else {
                    // Agregar línea de definición adicional
                    definedFunctions.get(functionName).push(i + 1);
                }
            }
        }
        // Generar issues para funciones que tienen múltiples definiciones
        for (const [functionName, lineNumbers] of definedFunctions.entries()) {
            // Si la función aparece en múltiples líneas de definición,
            // marcar todas excepto la primera como duplicadas
            if (lineNumbers.length > 1) {
                for (let j = 1; j < lineNumbers.length; j++) {
                    issues.push({
                        rule: 'duplicate-definition',
                        message: `Definición duplicada de '${functionName}'. Primera definición en línea ${lineNumbers[0]}.`,
                        line: lineNumbers[j],
                        column: 0,
                        severity: 'error'
                    });
                }
            }
        }
        return issues;
    },
};
//# sourceMappingURL=DuplicateDefinitionRule.js.map