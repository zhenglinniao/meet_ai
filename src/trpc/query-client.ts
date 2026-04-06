import {
  defaultShouldDehydrateQuery,
  QueryClient,
} from '@tanstack/react-query';
// 如果需要在服务端与客户端之间传递更复杂的数据结构，可以启用 superjson
// import superjson from 'superjson';
export function makeQueryClient() {
  return new QueryClient({
    defaultOptions: {
      queries: {
        // 30 秒内的数据视为新鲜，减少重复请求
        staleTime: 30 * 1000,
      },
      dehydrate: {
        // serializeData: superjson.serialize,
        shouldDehydrateQuery: (query) =>
          defaultShouldDehydrateQuery(query) ||
          query.state.status === 'pending',
      },
      hydrate: {
        // deserializeData: superjson.deserialize,
      },
    },
  });
}
