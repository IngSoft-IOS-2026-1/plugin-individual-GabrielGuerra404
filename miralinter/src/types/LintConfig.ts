export interface RuleConfig {
	enabled: boolean;
	[key: string]: boolean | string | number;
}

export interface LintConfig {
	rules: {
		[ruleName: string]: RuleConfig;
	};
}
