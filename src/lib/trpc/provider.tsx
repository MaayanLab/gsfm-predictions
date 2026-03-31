"use client"

import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import { httpBatchLink, getFetch, loggerLink, splitLink, isNonJsonSerializable, httpLink } from "@trpc/client"
import { useState } from "react"
// import superjson from "superjson"
import trpc from "./client"
// import { ReactQueryDevtools } from "@tanstack/react-query-devtools"

const linkFetch = async (input: RequestInfo | URL, init?: RequestInit | undefined) => {
  const fetch = getFetch()
  return fetch(input, {
    ...init,
    credentials: "include",
  })
}

const TrpcProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: { queries: { staleTime: 5000 } },
      })
  )

  const url = process.env.NEXT_PUBLIC_URL
    ? `${process.env.NEXT_PUBLIC_URL}/api/trpc/`
    : "http://localhost:3000/api/trpc/"

  const [trpcClient] = useState(() =>
    trpc.createClient({
      links: [
        loggerLink({
          enabled: () => true,
        }),
        splitLink({
          condition: op => isNonJsonSerializable(op.input),
          true: httpLink({
            url,
            fetch: linkFetch,
          }),
          false: httpBatchLink({
            url,
            fetch: linkFetch,
          })
        })
      ],
    })
  )
  return (
    <trpc.Provider client={trpcClient} queryClient={queryClient}>
      <QueryClientProvider client={queryClient}>
        {children}
        {/* <ReactQueryDevtools /> */}
      </QueryClientProvider>
    </trpc.Provider>
  )
}
export default TrpcProvider
