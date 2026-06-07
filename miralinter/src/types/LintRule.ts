import { LintIssue } from './LintIssue';
import { RuleConfig } from './LintConfig';

export interface LintRule {
    name: string;
    check: (code: string, config?: RuleConfig) => LintIssue[];
}