import { LintRule } from '../types/LintRule';
import { LintIssue } from '../types/LintIssue';
import { RuleConfig } from '../types/LintConfig';

export const duplicateDefinitionRule: LintRule = {
    name: 'duplicate-definition',
    check(code: string, config?: RuleConfig): LintIssue[] {
        const issues: LintIssue[] = [];
        // Almacenar las definiciones con su patrón completo (nombre + parámetros)
        const definedPatterns = new Map<string, number[]>();
        
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
            
            // Detectar patrón de definición: "nombre args = ..."
            // Extraer todo antes del '=' como el patrón
            const equalsIndex = trimmedLine.indexOf('=');
            if (equalsIndex !== -1) {
                const pattern = trimmedLine.substring(0, equalsIndex).trim();
                
                // Verificar que es una definición válida (empieza con identificador)
                if (/^[a-zA-Z_]\w*/.test(pattern)) {
                    if (!definedPatterns.has(pattern)) {
                        definedPatterns.set(pattern, [i + 1]);
                    } else {
                        // Agregar línea de definición con el mismo patrón
                        definedPatterns.get(pattern)!.push(i + 1);
                    }
                }
            }
        }
        
        // Generar issues solo para patrones duplicados exactos
        for (const [pattern, lineNumbers] of definedPatterns.entries()) {
            // Si el mismo patrón exacto aparece en múltiples líneas,
            // marcar todas excepto la primera como duplicadas
            if (lineNumbers.length > 1) {
                for (let j = 1; j < lineNumbers.length; j++) {
                    issues.push({
                        rule: 'duplicate-definition',
                        message: `Definición duplicada del patrón '${pattern}'. Primera definición en línea ${lineNumbers[0]}.`,
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