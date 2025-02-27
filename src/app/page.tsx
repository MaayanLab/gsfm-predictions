'use client'
import { useRouter } from 'next/navigation';
import React from 'react';
import GeneInput from '@/components/gene/GeneInput';

export default function Home() {
  const router = useRouter()
  return (
    <main className="mx-auto flex flex-col gap-4 items-center flex-grow">
      <div className="flex flex-col gap-1">
        <GeneInput
          onChange={value => {
            router.push(`/gene/${encodeURIComponent(value)}`)
          }}
        />
      </div>
    </main>
  )
}
