import Image from "next/image"

interface InfographicProps {
  src: string
  alt: string
  title: string
}

export default function Infographic({ src, alt, title }: InfographicProps) {
  return (
    <figure className="my-8">
      <p className="mb-3 font-sans text-base font-semibold text-foreground md:text-lg">
        {title}
      </p>
      <Image
        src={src}
        alt={alt}
        width={680}
        height={680}
        loading="lazy"
        sizes="(max-width: 768px) 100vw, 680px"
        className="w-full rounded-lg border border-border"
      />
    </figure>
  )
}
