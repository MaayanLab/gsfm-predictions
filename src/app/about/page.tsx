'use client'
import Content from './content.mdx'

export default function About() {
  return (
    <main className="bg-white py-2">
      <div className="mx-auto prose prose-h1:text-primary"><Content /></div>
    </main>
  )
}