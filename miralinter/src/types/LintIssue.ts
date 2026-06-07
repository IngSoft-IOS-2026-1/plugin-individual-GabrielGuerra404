export interface LintIssue {
	rule: string;
	message: string;
	line: number;
	column?: number;
	severity: 'warning' | 'error';
}