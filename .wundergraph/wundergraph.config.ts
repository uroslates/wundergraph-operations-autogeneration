import { configureWunderGraphApplication, cors, EnvironmentVariable, introspect, templates } from '@wundergraph/sdk';
import server from './wundergraph.server';
import operations from './wundergraph.operations';

const countries = introspect.graphql({
	apiNamespace: 'countries',
	url: 'https://countries.trevorblades.com/',
});

const occ = introspect.openApi({
	apiNamespace: 'occ',
	source: {
		kind: 'file',
		filePath: '../specs/occ.json',
	},
	baseURL: 'https://spartacus-demo.eastus.cloudapp.azure.com:8443/occ/v2/',
});

// configureWunderGraph emits the configuration
configureWunderGraphApplication({
	apis: [countries, occ],
	server,
	operations,
	codeGenerators: [
		{
			templates: [
				// use all the typescript react templates to generate a client
				...templates.typescript.all,
			],
		},
	],
	cors: {
		...cors.allowAll,
		// allowedOrigins:
		// 	process.env.NODE_ENV === 'production'
		// 		? [
		// 				// change this before deploying to production to the actual domain where you're deploying your app
		// 				'http://localhost:3000',
		// 		  ]
		// 		: ['http://localhost:3000', new EnvironmentVariable('WG_ALLOWED_ORIGIN')],
		allowedOrigins: ['http://localhost:3000','*'],
		allowCredentials: true,
	},
	security: {
		// enableGraphQLEndpoint: process.env.NODE_ENV !== 'production' || process.env.GITPOD_WORKSPACE_ID !== undefined,
		enableGraphQLEndpoint: true,
	},
});
