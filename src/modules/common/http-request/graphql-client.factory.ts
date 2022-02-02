import { GraphQLClient } from 'graphql-request';
import { StringRecord } from '../types';
import {
  GQLRequestDocument,
  GQLVariables,
  HttpRequestErrorParser,
} from './network.type';
import { graphqlErrorResponseToData } from './network.parser';
import { GraphQLError } from 'graphql-request/dist/types';

export const createGraphQLClient = (
  baseUrl: string,
  errorParser: HttpRequestErrorParser<GraphQLError>,
  headerProvider: () => StringRecord = () => ({}),
  interrupt: (error: any) => Promise<void>
) => {
  let client: GraphQLClient | null = null;

  const getClient = () => {
    if (client === null) {
      client = new GraphQLClient(baseUrl);
    }
    client.setHeaders(headerProvider());
    return client;
  };

  const graphqlCatchCommon = graphqlErrorResponseToData(interrupt);
  const exceptionHandler = errorParser.throwError;

  return {
    request<T = any, V = void | GQLVariables>(
      document: GQLRequestDocument,
      variables?: V
    ): Promise<T> {
      try {
        return getClient()
          .request(document, variables)
          .then((res) => res)
          .catch(graphqlCatchCommon);
      } catch (error) {
        return Promise.reject(error).catch(exceptionHandler);
      }
    },
  };
};
