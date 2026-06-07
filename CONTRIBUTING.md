# Contributing

¡Gracias por tu interés en contribuir!

## Setup

1. Clonar el repositorio:

   git clone <repo-url>

2. Instalar dependencias:

   npm install

3. Buildear el proyecto:

   npm run compile

4. Correr tests

   npm run test

## Reportar bugs

Al abrir un issue, por favor incluir:

- Pasos para reproducir
- Comportamiento esperado
- Comportamiento obtenido
- Muestra de código de Miranda para la que ocurre el bug

## Pull requests

Antes de crear un pull request:
- Todos los tests deben pasar sin fallos
- Agregar tests para nuevos features
- Actualizar documentación si es necesario
- Mantener commits enfocados en un solo cambio en vez de múltiples

## Añadir nuevas reglas

1. Crea una nueva clase para la nueva regla en `src/rules`
2. Registra la nueva regla en `const mirandaRules` en `src/mirandaLinter.ts` para que sea reconocida por el linter
3. Añadir pruebas unitarias
4. Añadir opciones de configuración en `miralinter.config.json`
**Requerimiento mínimo:** Se debe poder activar/desactivar la regla mediante el atributo `enabled`
5. Agregar la regla a la configuación por defecto en `src/mirandaLinter.ts`
6. Documenta la regla en `README.md`

## Estructura del proyecto

```
miralinter/
├── src/
│   ├── commands.ts          # Comandos de VS Code
│   ├── extension.ts         # Punto de entrada de la extensión
│   ├── mirandaLinter.ts     # Lógica principal del linter
│   ├── rules/               # Implementación de reglas
│   ├── types/               # Tipos TypeScript
│   └── test/                # Tests
├── miralinter.config.json   # Configuración por defecto
├── package.json
└── tsconfig.json
```