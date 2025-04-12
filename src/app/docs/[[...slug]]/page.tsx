import { Button } from '@/components/ui/button'
import { Scramble } from '@/components/effects/scramble'
export default function DocPage({ params }: { params: { slug?: string[] } }) {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold">Doc</h1>
      {params.slug && <p className="mt-4 text-lg">Current path: {params.slug.join('/')}</p>}
      <Button className="uppercase" size="lg">
        <Scramble text="Click me" />
      </Button>
    </div>
  )
}
