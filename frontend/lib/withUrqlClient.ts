import { cacheExchange } from "@urql/exchange-graphcache";
import { NextPage } from "next";
import { withUrqlClient as withUrqlClientImpl } from "next-urql";
import NextApp from "next/app";
import { dedupExchange, fetchExchange } from "urql";

import { User } from "./auth";
import { FoldersByWorkspaceDocument } from "./generated/graphql";

const isServerSide = typeof window === "undefined";

export default function withUrqlClient(
  component: NextPage<any> | typeof NextApp
) {
  return withUrqlClientImpl(
    (ssrExchange, ctx) => {
      if (ctx && ctx.req && ctx.res) {
        // @ts-ignore
        const user: User = ctx.req.user;
        if (!user) {
          ctx.res.writeHead(302, {
            Location: `/auth/login?next=${ctx.req.url}`,
          });
          ctx.res.end();
        }
      }
      return {
        exchanges: [
          dedupExchange,
          cacheExchange({
            keys: {},
            updates: {
              Mutation: {
                createFolder: (result, _args, cache) => {
                  cache.updateQuery(
                    {
                      query: FoldersByWorkspaceDocument,
                      variables: {
                        // @ts-ignore
                        workspace: result.createFolder.workspace,
                      },
                    },
                    (data) => {
                      // @ts-ignore
                      data?.foldersByWorkspace.push(result.createFolder);
                      return data;
                    }
                  );
                },
              },
            },
          }),
          ssrExchange,
          fetchExchange,
        ],
        url: isServerSide
          ? "http://workspace-service.workspace-service/graphql"
          : "/api/graphql",
      };
    },
    { ssr: true }
  )(component);
}
