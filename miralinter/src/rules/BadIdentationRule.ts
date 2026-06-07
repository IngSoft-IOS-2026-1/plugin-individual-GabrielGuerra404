import { LintRule } from '../types/LintRule';
import { LintIssue } from '../types/LintIssue';
import { RuleConfig } from '../types/LintConfig';

export const badIndentationRule: LintRule = {
    name: 'bad-identation',
    check(code: string, config?: RuleConfig): LintIssue[] {
        const issues: LintIssue[] = [];
        
        // Obtener el número de espacios esperados de la configuración (por defecto 4)
        const expectedSpaces = config?.indentationSpaces as number || 4;
        
        const lines = code.split('\n');
        
        for (let i = 0; i < lines.length; i++) {
            const line = lines[i];
            
            // Saltar líneas vacías
            if (line.trim().length === 0) {
                continue;
            }
            
            // Contar espacios al inicio de la línea
            const leadingSpaces = line.match(/^ */)?.[0].length || 0;
            
            // Verificar si la indentación es múltiple del número de espacios esperado
            if (leadingSpaces > 0 && leadingSpaces % expectedSpaces !== 0) {
                issues.push({
                    rule: 'bad-identation',
                    message: `Indentación incorrecta. Se esperaban múltiplos de ${expectedSpaces} espacios, se encontraron ${leadingSpaces}`,
                    line: i + 1,
                    column: leadingSpaces,
                    severity: 'warning'
                });
            }
        }
        
        return issues;
    },
};