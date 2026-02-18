import type { ServiceType } from "@/types"

interface ServiceTagChipProps {
  serviceType: ServiceType
  variant: "card" | "filter"
}

export const SERVICE_TAG_CONFIG: Record<ServiceType, { label: string; bgVar: string; textVar: string }> = {
  RODENT_CLEANUP:     { label: "Rodent Cleanup",     bgVar: "--chip-rodent-bg",         textVar: "--chip-rodent-text" },
  INSULATION_REMOVAL: { label: "Insulation Removal", bgVar: "--chip-insulation-bg",     textVar: "--chip-insulation-text" },
  DECONTAMINATION:    { label: "Decontamination",    bgVar: "--chip-decontamination-bg", textVar: "--chip-decontamination-text" },
  MOLD_REMEDIATION:   { label: "Mold Remediation",   bgVar: "--chip-mold-bg",           textVar: "--chip-mold-text" },
  GENERAL_CLEANING:   { label: "General Cleaning",   bgVar: "--chip-general-bg",        textVar: "--chip-general-text" },
  ATTIC_RESTORATION:  { label: "Attic Restoration",  bgVar: "--chip-restoration-bg",    textVar: "--chip-restoration-text" },
}

export default function ServiceTagChip({ serviceType, variant }: ServiceTagChipProps) {
  const config = SERVICE_TAG_CONFIG[serviceType]

  if (variant === "filter") {
    // Filter rendering handled by FilterToolbar component
    return null
  }

  return (
    <span
      style={{
        backgroundColor: `var(${config.bgVar})`,
        color: `var(${config.textVar})`,
      }}
      className="inline-flex items-center rounded-full border border-current/10 px-2.5 py-0.5 font-sans text-xs md:text-[13px] font-medium"
    >
      {config.label}
    </span>
  )
}
