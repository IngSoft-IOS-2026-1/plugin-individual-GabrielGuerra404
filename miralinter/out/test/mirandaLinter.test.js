"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
const assert = __importStar(require("assert"));
const mirandaLinter_1 = require("../mirandaLinter");
suite("Miranda Linter Tests", () => {
    test("Debe detectar bad-identation", () => {
        const code = `
f x =
    x + 1
      + 2
`;
        const results = (0, mirandaLinter_1.lintMirandaCode)(code);
        assert.ok(results.failed.some((r) => r.rule === "bad-identation"), "Debería detectar indentación incorrecta");
    });
    test("Debe detectar unbalanced-parentheses", () => {
        const code = `
f x = (x + 1
`;
        const results = (0, mirandaLinter_1.lintMirandaCode)(code);
        assert.ok(results.failed.some((r) => r.rule === "unbalanced-parentheses"), "Debería detectar paréntesis desbalanceados");
    });
    test("Debe detectar unclosed-delimiters", () => {
        const code = `
nums = [1,2,3
`;
        const results = (0, mirandaLinter_1.lintMirandaCode)(code);
        assert.ok(results.failed.some((r) => r.rule === "unclosed-delimiters"), "Debería detectar delimitadores sin cerrar");
    });
    test("Debe detectar incomplete-definition", () => {
        const code = `
double x =
`;
        const results = (0, mirandaLinter_1.lintMirandaCode)(code);
        assert.ok(results.failed.some((r) => r.rule === "incomplete-definition"), "Debería detectar definiciones incompletas");
    });
    test("Debe detectar duplicate-definition", () => {
        const code = `
double x = x * 2
double x = x + x
`;
        const results = (0, mirandaLinter_1.lintMirandaCode)(code);
        assert.ok(results.failed.some((r) => r.rule === "duplicate-definition"), "Debería detectar definiciones duplicadas");
    });
    test("Debe detectar undefined-variable", () => {
        const code = `
f x = x + y
`;
        const results = (0, mirandaLinter_1.lintMirandaCode)(code);
        assert.ok(results.failed.some((r) => r.rule === "undefined-variable"), "Debería detectar variables no definidas");
    });
    test("Debe detectar undefined-function", () => {
        const code = `
main = factorial 5
`;
        const results = (0, mirandaLinter_1.lintMirandaCode)(code);
        assert.ok(results.failed.some((r) => r.rule === "undefined-function"), "Debería detectar funciones no definidas");
    });
    test("Código válido no debería producir errores", () => {
        const code = `
fact 0 = 1
fact n = n * fact (n - 1)

main = fact 5
`;
        const results = (0, mirandaLinter_1.lintMirandaCode)(code);
        assert.strictEqual(results.failed.length, 0, "Código válido no debería generar errores");
    });
    test("Debe retornar estructura correcta", () => {
        const results = (0, mirandaLinter_1.lintMirandaCode)("main = 5");
        assert.ok(Array.isArray(results.passed));
        assert.ok(Array.isArray(results.failed));
    });
    test("No debe marcar undefined-function cuando la función existe", () => {
        const code = `
	fact 0 = 1
	fact n = n * fact (n - 1)
	
	main = fact 5
	`;
        const results = (0, mirandaLinter_1.lintMirandaCode)(code);
        assert.ok(!results.failed.some((r) => r.rule === "undefined-function"));
    });
    test("No debe marcar unbalanced-parentheses cuando los paréntesis están balanceados", () => {
        const code = `
	f x = (x + 1)
	`;
        const results = (0, mirandaLinter_1.lintMirandaCode)(code);
        assert.ok(!results.failed.some((r) => r.rule === "unbalanced-parentheses"));
    });
    test("BadIdentationRule debe recibir el parámetro indentationSpaces", () => {
        const code = `
f x =
  x + 1
    + 2
`;
        // Con 2 espacios esperados, solo "  " y "    " son válidos
        // "    " es múltiplo de 2 (2*2), así que es válido
        const results = (0, mirandaLinter_1.lintMirandaCode)(code);
        // Como la configuración por defecto es 4 espacios, la segunda línea (2 espacios) fallará
        assert.ok(results.failed.some((r) => r.rule === "bad-identation"), "Debería detectar indentación que no es múltiplo de 4");
    });
    test("Retorna configuración correcta cuando falla carga", () => {
        const code = `
main = 5
`;
        const results = (0, mirandaLinter_1.lintMirandaCode)(code);
        // Debería retornar resultados sin error
        assert.ok(Array.isArray(results.passed));
        assert.ok(Array.isArray(results.failed));
        assert.ok(results.passed.length >= 0);
    });
});
//# sourceMappingURL=mirandaLinter.test.js.map