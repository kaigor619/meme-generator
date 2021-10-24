module.exports = {
	globDirectory: 'build/',
	globPatterns: [
		'**/*.{json,css,ico,eot,ttf,woff,png,html,txt,js,svg,jpg}'
	],
	ignoreURLParametersMatching: [
		/^utm_/,
		/^fbclid$/
	],
	swDest: 'build/sw.js'
};