import { LintRule } from '../types/LintRule';
import { LintIssue } from '../types/LintIssue';
import { RuleConfig } from '../types/LintConfig';

export const undefinedVariableRule: LintRule = {
    name: 'undefined-variable',
    check(code: string, config?: RuleConfig): LintIssue[] {
        return [];
    },
};