const { readFileSync, writeFileSync, mkdirSync } = require('fs');
const { parse, Kind, print } = require('graphql');
const { resolve } = require('path');
const gqlg = require('gql-generator')

const startsWithTargetedApiNamespace = (apiNamespacePrefix) => (value) => value.startsWith(apiNamespacePrefix)
const isQueryDefinition = (def) => def.kind === Kind.OBJECT_TYPE_DEFINITION && def.name.value === 'Query';
const isMutationDefinition = (def) => def.kind === Kind.OBJECT_TYPE_DEFINITION && def.name.value === 'Mutation';

/**
 * Extract the namespace relevant operations from Wundergraph
 * and generate custom operations from them (nested within operations folder)
 */
function generateNamespeaceWundergraphGraphQlOperations({
  specificationFilePath,
  apiNamespace,
  operationDestinationDirPath,
  fileExtension
}) {
  try {
    const isApiNamespaceProvided = (apiNamespace || '').trim().length > 0;
    fileExtension = fileExtension || 'graphql';
    specificationFilePath = specificationFilePath || resolve(process.cwd(), '.wundergraph', 'generated', 'wundergraph.schema.graphql');
    apiNamespace = apiNamespace || '__all_';
    const apiNamespacePrefix = isApiNamespaceProvided ? `${apiNamespace.trim()}_` : '';
    const startsWithTargetedApiNamespaceFilter = startsWithTargetedApiNamespace(apiNamespacePrefix);
    const gqlSpecString = readFileSync(specificationFilePath).toString();
    const gqlSpec = parse(gqlSpecString);
    
    const namespacedGqlSpec = {
      ...gqlSpec,
      definitions: gqlSpec.definitions.map(def => {
        return !(isQueryDefinition(def) || isMutationDefinition(def)) ? def : {
            ...def,
            fields: def.fields.filter(queryOrMutationDef => startsWithTargetedApiNamespaceFilter(queryOrMutationDef.name.value))
          };
      })
    };
    const targetedDirPathSegments = [
      process.cwd(),
      `.wundergraph`,
      `.tmp`,
    ];
    if (isApiNamespaceProvided) {
      targetedDirPathSegments.push(apiNamespace);
    }
    const targetedDirPath = resolve(...targetedDirPathSegments);

    mkdirSync(targetedDirPath, { recursive: true })
    const schemaFilePath = resolve(targetedDirPath, `wundergraph.schema.${fileExtension}`);
    writeFileSync(schemaFilePath, print(namespacedGqlSpec));

    gqlg({
      schemaFilePath,
      destDirPath: operationDestinationDirPath || resolve(process.cwd(), `.wundergraph`, `operations`, `${apiNamespace}`),
      depthLimit: 2,
      fileExtension
    });
  } catch (error) {
    console.error('Error generating wundergraph GraphQL Operations!', error);
  }
}

const args = process.argv.slice(2);
generateNamespeaceWundergraphGraphQlOperations({
  apiNamespace: args.length > 0 && args[0]
});

