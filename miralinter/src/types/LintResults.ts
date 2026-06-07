import { LintIssue } from './LintIssue';

export interface LintResults {
	passed: string[];
	failed: LintIssue[];
}