import { GraphQLClient } from 'graphql-request'

// https://studio.apollographql.com/sandbox/explorer
// https://explorer.inigo.io/?sidebarTab=docs&otherTabs=variables&responseTab=response&docsPath=query
export const createGmxClient = () => {
    return new GraphQLClient('https://gmx.squids.live/gmx-synthetics-arbitrum:live/api/graphql', {
        cache: 'no-store',
    })
}
