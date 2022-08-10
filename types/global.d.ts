declare const __DEV__: boolean;

declare interface BeemoSettings {
	// Enable TypeScript decorators
	decorators?: boolean;
	// Enable ECMAScript modules
	esm?: boolean;
	// Is a Node.js project
	node?: boolean;
	// Enable Jest projects
	projects?: boolean;
	// Support React
	react?: boolean | 'classic' | 'automatic';
}
