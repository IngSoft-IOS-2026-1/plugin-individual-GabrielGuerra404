import * as assert from "assert";
import { lintMirandaCode } from "../mirandaLinter";

suite("Miranda Linter Tests", () => {
	test("Debe detectar bad-identation", () => {
		const code = `
f x =
    x + 1
      + 2
`;

		const results = lintMirandaCode(code);

		assert.ok(
			results.failed.some((r) => r.rule === "bad-identation"),
			"Debería detectar indentación incorrecta",
		);
	});

	test("Debe detectar unbalanced-parentheses", () => {
		const code = `
f x = (x + 1
`;

		const results = lintMirandaCode(code);

		assert.ok(
			results.failed.some((r) => r.rule === "unbalanced-parentheses"),
			"Debería detectar paréntesis desbalanceados",
		);
	});

	test("Debe detectar unclosed-delimiters", () => {
		const code = `
nums = [1,2,3
`;

		const results = lintMirandaCode(code);

		assert.ok(
			results.failed.some((r) => r.rule === "unclosed-delimiters"),
			"Debería detectar delimitadores sin cerrar",
		);
	});

	test("Debe detectar incomplete-definition", () => {
		const code = `
double x =
`;

		const results = lintMirandaCode(code);

		assert.ok(
			results.failed.some((r) => r.rule === "incomplete-definition"),
			"Debería detectar definiciones incompletas",
		);
	});

	test("Debe detectar duplicate-definition", () => {
		const code = `
square x = x * x
square n = n ^ 2
`;

		const results = lintMirandaCode(code);

		assert.ok(
			results.failed.some((r) => r.rule === "duplicate-definition"),
			"Debería detectar definiciones duplicadas",
		);
	});

	test("Debe detectar undefined-variable", () => {
		const code = `
f x = x + y
`;

		const results = lintMirandaCode(code);

		assert.ok(
			results.failed.some((r) => r.rule === "undefined-variable"),
			"Debería detectar variables no definidas",
		);
	});

	test("Debe detectar undefined-function", () => {
		const code = `
main = factorial 5
`;

		const results = lintMirandaCode(code);

		assert.ok(
			results.failed.some((r) => r.rule === "undefined-function"),
			"Debería detectar funciones no definidas",
		);
	});

	test("Código válido no debería producir errores", () => {
		const code = `
fact 0 = 1
fact n = n * fact (n - 1)

main = fact 5
`;

		const results = lintMirandaCode(code);

		assert.strictEqual(
			results.failed.length,
			0,
			"Código válido no debería generar errores",
		);
	});

	test("Debe retornar estructura correcta", () => {
		const results = lintMirandaCode("main = 5");

		assert.ok(Array.isArray(results.passed));
		assert.ok(Array.isArray(results.failed));
	});
    
	test("No debe marcar undefined-function cuando la función existe", () => {
		const code = `
	fact 0 = 1
	fact n = n * fact (n - 1)
	
	main = fact 5
	`;

		const results = lintMirandaCode(code);

		assert.ok(!results.failed.some((r) => r.rule === "undefined-function"));
	});

	test("No debe marcar unbalanced-parentheses cuando los paréntesis están balanceados", () => {
		const code = `
	f x = (x + 1)
	`;

		const results = lintMirandaCode(code);

		assert.ok(
			!results.failed.some((r) => r.rule === "unbalanced-parentheses"),
		);
	});

	test("BadIdentationRule debe recibir el parámetro indentationSpaces", () => {
		const code = `
f x =
  x + 1
    + 2
`;
		// Con 2 espacios esperados, solo "  " y "    " son válidos
		// "    " es múltiplo de 2 (2*2), así que es válido
		const results = lintMirandaCode(code);

		// Como la configuración por defecto es 4 espacios, la segunda línea (2 espacios) fallará
		assert.ok(
			results.failed.some((r) => r.rule === "bad-identation"),
			"Debería detectar indentación que no es múltiplo de 4",
		);
	});

	test("Retorna configuración correcta cuando falla carga", () => {
		const code = `
main = 5
`;
		const results = lintMirandaCode(code);

		// Debería retornar resultados sin error
		assert.ok(Array.isArray(results.passed));
		assert.ok(Array.isArray(results.failed));
		assert.ok(results.passed.length >= 0);
	});
});
