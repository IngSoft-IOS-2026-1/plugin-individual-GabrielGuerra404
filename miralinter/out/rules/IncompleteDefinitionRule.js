"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.incompleteDefinitionRule = void 0;
exports.incompleteDefinitionRule = {
    name: 'incomplete-definition',
    check(code, config) {
        const issues = [];
        const lines = code.split('\n');
        for (let i = 0; i < lines.length; i++) {
            const line = lines[i];
            const trimmedLine = line.trim();
            // Saltar líneas vacías y comentarios
            if (!trimmedLine || trimmedLine.startsWith('//')) {
                continue;
            }
            // Solo procesar líneas que no estén indentadas (definiciones de nivel superior)
            const leadingSpaces = line.match(/^ */)?.[0].length || 0;
            if (leadingSpaces > 0) {
                continue;
            }
            // Detectar patrón de definición: "nombre args ="
            const equalsIndex = trimmedLine.indexOf('=');
            if (equalsIndex !== -1) {
                // Obtener la parte después del signo igual
                const afterEquals = trimmedLine.substring(equalsIndex + 1).trim();
                // Si después del = no hay nada, podría ser incompleta
                if (afterEquals.length === 0) {
                    // Verificar si hay una línea siguiente indentada (continuación válida)
                    const nextLineSpaces = (lines[i + 1]?.match(/^ */) ?? [])[0]?.length ?? 0;
                    const hasIndentedContinuation = i + 1 < lines.length &&
                        lines[i + 1].trim().length > 0 &&
                        nextLineSpaces > 0;
                    // Si no hay continuación indentada, es una definición incompleta
                    if (!hasIndentedContinuation) {
                        const functionMatch = trimmedLine.match(/^([a-zA-Z_]\w*)\s+/);
                        const functionName = functionMatch ? functionMatch[1] : 'función';
                        issues.push({
                            rule: 'incomplete-definition',
                            message: `Definición incompleta de '${functionName}'. Falta la expresión después del '='.`,
                            line: i + 1,
                            column: equalsIndex + 1,
                            severity: 'error'
                        });
                    }
                }
            }
        }
        return issues;
    },
};
//# sourceMappingURL=IncompleteDefinitionRule.js.map