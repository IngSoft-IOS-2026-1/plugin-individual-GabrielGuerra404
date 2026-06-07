import { LintRule } from '../types/LintRule';
import { LintIssue } from '../types/LintIssue';
import { RuleConfig } from '../types/LintConfig';

// Funciones built-in comunes en Miranda
const BUILTIN_FUNCTIONS = new Set([
    // Funciones aritméticas
    'abs', 'sign', 'min', 'max', 'gcd', 'lcm',
    // Funciones de listas
    'length', 'head', 'tail', 'reverse', 'sort', 'append', 'take', 'drop',
    'map', 'filter', 'foldl', 'foldr', 'zip', 'unzip',
    // Funciones de strings
    'strlen', 'substr', 'concat', 'chars', 'ord', 'chr',
    // Funciones de entrada/salida
    'print', 'println', 'read', 'readln', 'show', 'hd', 'tl',
    // Funciones de tipo
    'null', 'not', 'even', 'odd', 'isalpha', 'isdigit',
    // Funciones de orden superior
    'compose', 'flip', 'curry', 'uncurry',
    // Operadores comunes representados como funciones
    'div', 'mod', 'rem', 'pow', 'sqrt', 'exp', 'log', 'sin', 'cos', 'tan',
    // Más funciones built-in
    'id', 'const', 'fst', 'snd', 'error', 'undefined'
]);

export const undefinedFunctionRule: LintRule = {
    name: 'undefined-function',
    check(code: string, config?: RuleConfig): LintIssue[] {
        const issues: LintIssue[] = [];
        const lines = code.split('\n');
        
        // Paso 1: Recolectar todas las definiciones de funciones
        const definedFunctions = new Set<string>();
        
        for (const line of lines) {
            const trimmed = line.trim();
            
            // Saltar líneas vacías y comentarios
            if (!trimmed || trimmed.startsWith('//')) {
                continue;
            }
            
            // Solo procesar líneas sin indentación (definiciones de nivel superior)
            if (line.match(/^ /)) {
                continue;
            }
            
            // Extraer el nombre de la función: "nombre args = ..."
            const definitionMatch = trimmed.match(/^([a-zA-Z_]\w*)\s*/);
            if (definitionMatch && trimmed.includes('=')) {
                definedFunctions.add(definitionMatch[1]);
            }
        }
        
        // Paso 2: Buscar llamadas a funciones
        for (let i = 0; i < lines.length; i++) {
            const line = lines[i];
            const trimmed = line.trim();
            
            // Saltar líneas vacías y comentarios
            if (!trimmed || trimmed.startsWith('//')) {
                continue;
            }
            
            // Buscar identificadores en la línea
            // Expresión regular para encontrar identificadores válidos
            const identifierRegex = /\b([a-zA-Z_]\w*)\b/g;
            let match;
            
            while ((match = identifierRegex.exec(trimmed)) !== null) {
                const identifier = match[1];
                const position = match.index;
                
                // Saltar si es una palabra clave reservada
                if (['if', 'then', 'else', 'where', 'let', 'in', 'otherwise'].includes(identifier)) {
                    continue;
                }
                
                // Saltar si es un operador especial
                if (['and', 'or', 'not', 'div', 'mod', 'rem'].includes(identifier)) {
                    continue;
                }
                
                // Saltar si es parámetro de función (aparece antes del =)
                const beforeIdentifier = trimmed.substring(0, position);
                if (beforeIdentifier.includes('=')) {
                    // Está después del =, podría ser una llamada
                } else {
                    // Está antes del =, probablemente es un parámetro
                    continue;
                }
                
                // Verificar si el identificador es:
                // 1. Una función definida
                // 2. Una función built-in
                // 3. Una variable (parámetro)
                if (!definedFunctions.has(identifier) && 
                    !BUILTIN_FUNCTIONS.has(identifier)) {
                    
                    // Verificar si podría ser una variable local (parámetro)
                    // Extraer la definición actual de esta línea
                    const defMatch = trimmed.match(/^([a-zA-Z_]\w*)\s+([a-zA-Z_]\w*[\s\w]*)\s*=/);
                    if (defMatch) {
                        const params = defMatch[2].split(/\s+/);
                        if (params.includes(identifier)) {
                            continue; // Es un parámetro
                        }
                    }
                    
                    // Es una llamada a función indefinida
                    const columnNumber = line.indexOf(identifier) + 1;
                    issues.push({
                        rule: 'undefined-function',
                        message: `Función no definida '${identifier}'.`,
                        line: i + 1,
                        column: columnNumber,
                        severity: 'error'
                    });
                }
            }
        }
        
        return issues;
    },
};