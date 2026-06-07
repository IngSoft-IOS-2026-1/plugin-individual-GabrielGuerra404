# Miranda Linter (miralinter)

Una extensión con múltiples funcionalidades de ESLint para el lenguaje de programación Miranda. Detecta errores comunes de sintaxis y código.

## Características

- **7 reglas de linting** para validar código Miranda
- **Configuración personalizable** mediante `miralinter.config.json`
- **Detección de errores** ejecutando el comando miralinter 
- **Pattern matching support** (definiciones con múltiples cláusulas)
- **Parámetros configurables** por regla

## Implemented rules

### Como extensión de VS Code

1. Clona este repositorio
2. Navega a la carpeta `miralinter`
3. Instala las dependencias:
   ```bash
   npm install
   ```
4. Compila el proyecto:
   ```bash
   npm run compile
   ```
5. Empaqueta la extensión:
   ```bash
   vsce package
   ```
6. Instala el archivo `.vsix` generado en VS Code

### Desarrollo local

```bash
cd miralinter
npm install
npm run build
```

## 🚀 Uso

### Ejecutar el linter

```bash
npm run lint
```

### Correr los tests

```bash
npm run test
```

## Configuración

El linter se configura mediante el archivo `miralinter.config.json` en la raíz del proyecto.

### Ejemplo de configuración

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

### Deshabilitar/Habilitar una regla
Para deshabilitar una regla hay que establecer el valor de `enabled` en **false**
Para activar una regla hay que establecer el valor de `enabled` en **true**

#### Regla activada
```json
{
  "rules": {
    "undefined-variable": {
      "enabled": true
    }
  }
}
```
#### Regla desactivada
```json
{
  "rules": {
    "undefined-variable": {
      "enabled": false
    }
  }
}
```

## Reglas disponibles

### bad-identation

Detecta indentación incorrecta que no es múltiplo del número de espacios esperado.

- **Severidad**: warning
- **Parámetro**: `indentationSpaces` (default: 4)

**Ejemplo:**
```miranda
f x =
  x + 1      // ✗ Error: 2 espacios, se esperan múltiplos de 4
    + 2      // ✓ Válido: 4 espacios
```

### unbalanced-parentheses

Detecta paréntesis desbalanceados o sin cerrar.

- **Severidad**: error

**Ejemplo:**
```miranda
f x = (x + 1   // ✗ Error: paréntesis sin cerrar
f x = (x + 1)  // ✓ Válido
```

### unclosed-delimiters

Detecta corchetes `[]` y llaves `{}` sin cerrar.

- **Severidad**: error

**Ejemplo:**
```miranda
nums = [1,2,3     // ✗ Error: corchete sin cerrar
nums = [1,2,3]    // ✓ Válido
```

### incomplete-definition

Detecta definiciones de función incompletas sin expresión.

- **Severidad**: error

**Ejemplo:**
```miranda
double x =       // ✗ Error: falta expresión
double x = 2 * x // ✓ Válido
```

### duplicate-definition

Detecta definiciones duplicadas con el mismo patrón exacto.

- **Severidad**: error

**Nota**: Las definiciones con parámetros diferentes son válidas (pattern matching).

**Ejemplo:**
```miranda
square x = x * x    // ✓ Válido
square n = n ^ 2    // ✓ Válido (parámetros diferentes)

fact 0 = 1
fact 0 = 2          // ✗ Error: mismo patrón "fact 0"
```

### undefined-variable

Detecta variables no definidas en una expresión.

- **Severidad**: error

**Ejemplo:**
```miranda
f x = x + y    // ✗ Error: y no definida
f x = x + 1    // ✓ Válido
```

### undefined-function

Detecta llamadas a funciones no definidas.

- **Severidad**: error

**Ejemplo:**
```miranda
main = factorial 5    // ✗ Error: factorial no definida
fact n = n * fact (n - 1)
main = fact 5         // ✓ Válido
```

## 📖 Documentación detallada

Para más información sobre la configuración, consulta [CONFIGURACION.md](./CONFIGURACION.md)

## 🧪 Testing

El proyecto incluye tests completos para todas las reglas:

```bash
npm run test
```




## Contribuciones
Para reportar bugs o contribuir, leer el documento de CONTRIBUTING.md
