# Sistema de Configuración de Reglas - miralinter

## Descripción General

El sistema de linting de Miranda ahora soporta un archivo de configuración JSON que permite:
- **Habilitar/Deshabilitar reglas**: Control granular sobre qué reglas se aplican
- **Parámetros específicos por regla**: Personalizar el comportamiento de cada regla

## Archivo de Configuración

El archivo `miralinter.config.json` se encuentra en la raíz del proyecto y define la configuración de todas las reglas.

### Estructura Básica

```json
{
  "rules": {
    "bad-identation": {
      "enabled": true,
      "indentationSpaces": 4
    },
    "unbalanced-parentheses": {
      "enabled": true
    },
    "unclosed-delimiters": {
      "enabled": true
    },
    "incomplete-definition": {
      "enabled": true
    },
    "duplicate-definition": {
      "enabled": true
    },
    "undefined-variable": {
      "enabled": true
    },
    "undefined-function": {
      "enabled": true
    }
  }
}
```

## Cómo Usar

### 1. Deshabilitar una Regla

Para desactivar una regla específica, cambia `enabled` a `false`:

```json
{
  "rules": {
    "bad-identation": {
      "enabled": false,
      "indentationSpaces": 4
    }
  }
}
```

### 2. Configurar Parámetros de una Regla

Cada regla puede tener parámetros específicos. Por ejemplo, `bad-identation` acepta el parámetro `indentationSpaces`:

```json
{
  "rules": {
    "bad-identation": {
      "enabled": true,
      "indentationSpaces": 2    // Usar 2 espacios en lugar de 4
    }
  }
}
```

### 3. Ejemplos de Configuración

**Configuración estricta (solo indentación de 2 espacios):**
```json
{
  "rules": {
    "bad-identation": {
      "enabled": true,
      "indentationSpaces": 2
    }
  }
}
```

**Desabilitar solo la regla de variables indefinidas:**
```json
{
  "rules": {
    "undefined-variable": {
      "enabled": false
    }
  }
}
```

**Configuración personalizada:**
```json
{
  "rules": {
    "bad-identation": {
      "enabled": true,
      "indentationSpaces": 4
    },
    "unbalanced-parentheses": {
      "enabled": false
    },
    "undefined-variable": {
      "enabled": true
    }
  }
}
```

## Reglas Disponibles

### bad-identation
- **Descripción**: Detecta indentación incorrecta
- **Parámetros**: 
  - `indentationSpaces` (número): Número de espacios esperados por nivel de indentación (por defecto: 4)
- **Severidad**: warning

### unbalanced-parentheses
- **Descripción**: Detecta paréntesis desbalanceados
- **Parámetros**: Ninguno
- **Severidad**: error

### unclosed-delimiters
- **Descripción**: Detecta delimitadores (corchetes, llaves) sin cerrar
- **Parámetros**: Ninguno
- **Severidad**: error

### incomplete-definition
- **Descripción**: Detecta definiciones de función incompletas
- **Parámetros**: Ninguno
- **Severidad**: error

### duplicate-definition
- **Descripción**: Detecta definiciones duplicadas de funciones
- **Parámetros**: Ninguno
- **Severidad**: error

### undefined-variable
- **Descripción**: Detecta variables no definidas
- **Parámetros**: Ninguno
- **Severidad**: error

### undefined-function
- **Descripción**: Detecta llamadas a funciones no definidas
- **Parámetros**: Ninguno
- **Severidad**: error

## Comportamiento por Defecto

Si el archivo `miralinter.config.json` no existe o no puede ser leído, el sistema utiliza la configuración por defecto con todas las reglas habilitadas y los parámetros estándar.

## Cómo Agregar Parámetros a Nuevas Reglas

1. Agrega el parámetro al archivo de configuración:
```json
{
  "rules": {
    "mi-regla": {
      "enabled": true,
      "miParametro": "valor"
    }
  }
}
```

2. Accede al parámetro en la regla:
```typescript
export const miRegla: LintRule = {
    name: 'mi-regla',
    check(code: string, config?: RuleConfig): LintIssue[] {
        const miParametro = config?.miParametro;
        // Usar miParametro aquí
        return [];
    },
};
```

## Ejemplo Práctico

**Scenario**: Tu equipo prefiere indentación de 2 espacios y quiere desabilitar la detección de variables indefinidas para código experimental.

```json
{
  "rules": {
    "bad-identation": {
      "enabled": true,
      "indentationSpaces": 2
    },
    "unbalanced-parentheses": {
      "enabled": true
    },
    "unclosed-delimiters": {
      "enabled": true
    },
    "incomplete-definition": {
      "enabled": true
    },
    "duplicate-definition": {
      "enabled": true
    },
    "undefined-variable": {
      "enabled": false
    },
    "undefined-function": {
      "enabled": true
    }
  }
}
```
