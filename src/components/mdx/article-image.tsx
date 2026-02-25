import Image from "next/image"

interface ArticleImageProps {
  src: string
  alt: string
  caption?: string
  priority?: boolean
}

export default function ArticleImage({
  src,
  alt,
  caption,
  priority,
}: ArticleImageProps) {
  return (
    <figure className="my-6">
      <Image
        src={src}
        alt={alt}
        width={680}
        height={383}
        loading={priority ? "eager" : "lazy"}
        priority={priority}
        sizes="(max-width: 768px) 100vw, 680px"
        className="w-full rounded-lg"
      />
      {caption && (
        <figcaption className="mt-2 text-center font-sans text-sm text-muted-foreground">
          {caption}
        </figcaption>
      )}
    </figure>
  )
}
