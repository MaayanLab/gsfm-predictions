import { Metadata } from 'next'
import React from 'react'
export const metadata: Metadata = {
  title: 'Gene Set Enrichment Analysis',
}
export default function Layout(props: { children: React.ReactNode }) {
  return props.children
}