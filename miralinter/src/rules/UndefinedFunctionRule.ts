import { LintRule } from '../types/LintRule';
import { LintIssue } from '../types/LintIssue';
import { RuleConfig } from '../types/LintConfig';

export const undefinedFunctionRule: LintRule = {
    name: 'undefined-function',
    check(code: string, config?: RuleConfig): LintIssue[] {
        return [];
    },
};