import * as vscode from 'vscode';
import { lintMirandaCode, showLintResults } from './mirandaLinter';

/**
 * Comando que ejecuta el linting en el código Miranda del editor activo
 */
export function registerLintCommand(context: vscode.ExtensionContext): void {
	const disposable = vscode.commands.registerCommand('miralinter.lintCode', () => {
		const editor = vscode.window.activeTextEditor;

		if (!editor) {
			vscode.window.showErrorMessage('No hay un archivo abierto para analizar');
			return;
		}

		// Obtiene el código del documento actual
		const code = editor.document.getText();

		// Ejecuta el linting
		const results = lintMirandaCode(code);

		// Muestra los resultados
		showLintResults(results);
	});

	context.subscriptions.push(disposable);
}
