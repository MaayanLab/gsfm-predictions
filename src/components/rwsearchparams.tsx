'use client'

import { useRouter, useSearchParams } from 'next/navigation'

export default function useRWSearchParams() {
  const router = useRouter()
  const searchParams = useSearchParams()
  return [
    searchParams,
    (cb: (searchParams: URLSearchParams) => void, opts?: { push?: boolean, scroll?: boolean, preserveHash?: boolean }) => {
      const newSearchParams = new URLSearchParams(searchParams)
      cb(newSearchParams)
      const router_augment = opts?.push ? router.push : router.replace
      router_augment(`?${newSearchParams.toString()}${opts?.preserveHash ? window.location.hash : ''}`, opts)
    }
  ] as const
}
