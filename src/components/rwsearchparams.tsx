'use client'

import { useRouter, useSearchParams } from 'next/navigation'

export default function useRWSearchParams() {
  const router = useRouter()
  const searchParams = useSearchParams()
  return [
    searchParams,
    (cb: (searchParams: URLSearchParams) => void, opts?: { scroll?: boolean }) => {
      const newSearchParams = new URLSearchParams(searchParams)
      cb(newSearchParams)
      router.replace(`?${newSearchParams.toString()}${window.location.hash}`, opts)
    }
  ] as const
}
