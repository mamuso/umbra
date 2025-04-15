import { notFound } from 'next/navigation'
import fs from 'fs'
import path from 'path'
import { compileMDX } from 'next-mdx-remote/rsc'

type Frontmatter = {
  title: string
}

async function getMdxContent(slug: string[]) {
  const filePath = path.join(process.cwd(), 'src/mdx/components', `${slug.join('/')}.mdx`)

  try {
    const content = await fs.promises.readFile(filePath, 'utf8')
    return content
  } catch (error) {
    return null
  }
}

export default async function DocPage({ params }: { params: { slug?: string[] } }) {
  if (!params.slug) {
    return (
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-4xl font-bold">Components</h1>
        <p className="mt-4 text-lg">Select a component to view its documentation</p>
      </div>
    )
  }

  const content = await getMdxContent(params.slug)

  if (!content) {
    notFound()
  }

  const { content: mdxContent, frontmatter } = await compileMDX<Frontmatter>({
    source: content,
    options: {
      parseFrontmatter: true,
    },
  })

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold">{frontmatter.title}</h1>
      <div className="prose dark:prose-invert max-w-none mt-8">{mdxContent}</div>
    </div>
  )
}
