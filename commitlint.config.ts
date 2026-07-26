import type { UserConfig } from "@commitlint/types";

const config: UserConfig = {
	extends: ["@commitlint/config-conventional"],

	rules: {
		"type-case": [2, "always", "lower-case"],
		"type-empty": [2, "never"],
		"scope-case": [2, "always", "lower-case"],
		"scope-empty": [0, "never"], // scope is optional
		"subject-empty": [2, "never"],
		"subject-case": [2, "never", ["start-case", "pascal-case", "upper-case"]],
		"subject-full-stop": [2, "never", "."],
		"header-max-length": [2, "always", 100],
		"body-leading-blank": [2, "always"],
		"footer-leading-blank": [2, "always"],
		// "scope-enum": [
		// 	2,
		// 	"always",
		// 	[
		// 		"app",
		// 		"components",
		// 		"ui",
		// 		"features",
		// 		"hooks",
		// 		"lib",
		// 		"utils",
		// 		"types",
		// 		"styles",
		// 		"assets",
		// 		"config",
		// 		"api",
		// 		"middleware",
		// 		"auth",
		// 		"db",
		// 		"tests",
		// 		"docs",
		// 		"deps",
		// 		"build",
		// 		"ci",
		// 		"release",
		// 	],
		// ],

		"type-enum": [
			2,
			"always",
			[
				"feat", // A new feature
				"fix", // A bug fix
				"docs", // Documentation only changes
				"style", // Changes that don't affect code meaning (whitespace, semicolons, etc.)
				"refactor", // A code change that neither fixes a bug nor adds a feature
				"perf", // A code change that improves performance
				"test", // Adding missing tests or correcting existing tests
				"chore", // Changes to build process, dependencies, tools, or CI/CD
				"ci", // Changes to CI configuration files and scripts
				"revert", // Reverts a previous commit
			],
		],
	},
	ignores: [
		(commit) => commit === "",
		(commit) => commit.startsWith("WIP:"),
		(commit) => /^(Merge|Revert)/.test(commit),
	],
};

export default config;
