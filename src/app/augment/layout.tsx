import { Metadata } from 'next'
import React from 'react'
export const metadata: Metadata = {
  title: 'Augment',
}
export default function Layout(props: { children: React.ReactNode }) {
  return props.children
}