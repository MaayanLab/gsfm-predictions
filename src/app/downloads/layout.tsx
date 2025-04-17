import { Metadata } from 'next'
import React from 'react'
export const metadata: Metadata = {
  title: 'Downloads',
}
export default function Layout(props: { children: React.ReactNode }) {
  return props.children
}