import "dotenv/config"
import { writeFileSync, mkdirSync, existsSync } from "fs"
import { resolve, dirname } from "path"
import { execSync } from "child_process"
import { GoogleGenAI } from "@google/genai"

// ─── Configuration ──────────────────────────────────────

const API_KEY = process.env.GEMINI_API_KEY
if (!API_KEY) {
  console.error("Error: GEMINI_API_KEY environment variable is not set.")
  process.exit(1)
}

const ai = new GoogleGenAI({ apiKey: API_KEY })
const MODEL = "imagen-4.0-generate-001"

const PUBLIC_DIR = resolve(process.cwd(), "public")
const ARTICLES_DIR = resolve(PUBLIC_DIR, "images/articles")
const LISTICLE_DIR = resolve(PUBLIC_DIR, "images/articles/listicle")

// ─── Image Specification ────────────────────────────────

interface ImageSpec {
  filename: string
  outputDir: string
  type: "hero" | "inline" | "infographic"
  prompt: string
  metro: string
}

const METROS = ["phoenix-az", "los-angeles-ca", "houston-tx", "dallas-tx", "atlanta-ga"]

function buildImageManifest(): ImageSpec[] {
  const specs: ImageSpec[] = []

  // ── Phoenix, AZ ────────────────────────────────────
  specs.push(
    {
      filename: "best-attic-cleaning-phoenix-az.webp",
      outputDir: ARTICLES_DIR,
      type: "hero",
      prompt:
        "Professional attic cleaning crew working in a residential attic in Phoenix Arizona. Desert landscape visible through a small attic window. Workers in protective gear with HEPA vacuum equipment removing old fiberglass insulation. Warm lighting, photorealistic, high quality commercial photography style. No text or watermarks.",
      metro: "phoenix-az",
    },
    {
      filename: "phoenix-az-attic-heat-damage.webp",
      outputDir: LISTICLE_DIR,
      type: "inline",
      prompt:
        "Close-up of degraded attic insulation in a Phoenix Arizona home showing heat damage and compression. Terracotta roof tiles visible, extreme sunlight filtering through vents. Photorealistic, editorial photography style. No text or watermarks.",
      metro: "phoenix-az",
    },
    {
      filename: "phoenix-az-insulation-install.webp",
      outputDir: LISTICLE_DIR,
      type: "inline",
      prompt:
        "Professional technician installing fresh blown-in insulation in a clean attic space in a Phoenix Arizona suburban home. Worker wearing protective suit and respirator. Clean, well-lit attic with radiant barrier visible on rafters. Photorealistic commercial photography. No text or watermarks.",
      metro: "phoenix-az",
    },
    {
      filename: "phoenix-az-infographic.webp",
      outputDir: LISTICLE_DIR,
      type: "infographic",
      prompt:
        "Clean modern infographic illustration showing a cross-section of a residential home attic in desert climate. Labeled diagram showing insulation layers, radiant barrier, ventilation, and common problem areas like rodent entry points and moisture damage zones. Warm color palette with oranges and browns. Professional clean design, flat illustration style. No real photographs.",
      metro: "phoenix-az",
    }
  )

  // ── Los Angeles, CA ────────────────────────────────
  specs.push(
    {
      filename: "best-attic-cleaning-los-angeles-ca.webp",
      outputDir: ARTICLES_DIR,
      type: "hero",
      prompt:
        "Professional attic cleaning team working inside a Spanish-style Los Angeles California home attic. Palm trees visible through attic vent. Workers in protective gear inspecting insulation near clay tile roof. Bright California sunshine, photorealistic commercial photography. No text or watermarks.",
      metro: "los-angeles-ca",
    },
    {
      filename: "los-angeles-ca-rodent-damage.webp",
      outputDir: LISTICLE_DIR,
      type: "inline",
      prompt:
        "Attic space in Los Angeles California home showing evidence of rodent activity with disturbed insulation and chewed wiring. Professional inspector with flashlight documenting damage. Photorealistic editorial photography. No text or watermarks.",
      metro: "los-angeles-ca",
    },
    {
      filename: "los-angeles-ca-clean-attic.webp",
      outputDir: LISTICLE_DIR,
      type: "inline",
      prompt:
        "Beautifully clean and restored attic in a Los Angeles California home after professional cleaning. Fresh insulation, sealed air ducts, organized space with proper ventilation. Bright natural light, photorealistic before-after style commercial photography. No text or watermarks.",
      metro: "los-angeles-ca",
    },
    {
      filename: "los-angeles-ca-infographic.webp",
      outputDir: LISTICLE_DIR,
      type: "infographic",
      prompt:
        "Clean modern infographic illustration showing a cross-section of a California Spanish-style home attic. Labeled diagram showing wildfire-resistant materials, earthquake bracing, proper ventilation for coastal climate, and pest entry prevention. Cool blue and terracotta color palette. Professional flat illustration style. No real photographs.",
      metro: "los-angeles-ca",
    }
  )

  // ── Houston, TX ────────────────────────────────────
  specs.push(
    {
      filename: "best-attic-cleaning-houston-tx.webp",
      outputDir: ARTICLES_DIR,
      type: "hero",
      prompt:
        "Professional attic cleaning crew in a Houston Texas suburban home attic. High-pitched roof, workers in protective gear using industrial vacuum to remove mold-affected insulation in humid environment. Condensation visible on rafters. Photorealistic commercial photography. No text or watermarks.",
      metro: "houston-tx",
    },
    {
      filename: "houston-tx-mold-remediation.webp",
      outputDir: LISTICLE_DIR,
      type: "inline",
      prompt:
        "Close-up of mold growth on attic wood rafters in a Houston Texas home. Professional remediation technician in full Tyvek suit applying antimicrobial treatment. Humid conditions visible. Photorealistic editorial photography. No text or watermarks.",
      metro: "houston-tx",
    },
    {
      filename: "houston-tx-moisture-barrier.webp",
      outputDir: LISTICLE_DIR,
      type: "inline",
      prompt:
        "Professional installing vapor barrier and new insulation in Houston Texas home attic after moisture remediation. Clean, organized workspace with professional equipment. Photorealistic commercial photography. No text or watermarks.",
      metro: "houston-tx",
    },
    {
      filename: "houston-tx-infographic.webp",
      outputDir: LISTICLE_DIR,
      type: "infographic",
      prompt:
        "Clean modern infographic illustration showing a cross-section of a Houston Texas residential attic. Labeled diagram showing moisture problems in humid subtropical climate: mold growth zones, condensation points, proper vapor barriers, hurricane-rated ventilation, and dehumidification. Teal and warm gray color palette. Professional flat illustration style. No real photographs.",
      metro: "houston-tx",
    }
  )

  // ── Dallas, TX ─────────────────────────────────────
  specs.push(
    {
      filename: "best-attic-cleaning-dallas-tx.webp",
      outputDir: ARTICLES_DIR,
      type: "hero",
      prompt:
        "Professional attic cleaning team working in a Dallas Texas ranch-style suburban home attic. Large open attic space with workers in protective gear operating truck-mounted vacuum hose for insulation removal. Summer heat visible through attic vents. Photorealistic commercial photography. No text or watermarks.",
      metro: "dallas-tx",
    },
    {
      filename: "dallas-tx-insulation-removal.webp",
      outputDir: LISTICLE_DIR,
      type: "inline",
      prompt:
        "Workers removing old blown-in cellulose insulation from a Dallas Texas home attic using industrial vacuum equipment. Large ranch-style attic with exposed rafters. Dust particles visible in beam of work light. Photorealistic editorial photography. No text or watermarks.",
      metro: "dallas-tx",
    },
    {
      filename: "dallas-tx-energy-upgrade.webp",
      outputDir: LISTICLE_DIR,
      type: "inline",
      prompt:
        "Completed attic energy efficiency upgrade in a Dallas Texas home. Fresh spray foam insulation on roof deck, sealed ductwork, and radiant barrier installed. Clean professional result. Photorealistic commercial photography. No text or watermarks.",
      metro: "dallas-tx",
    },
    {
      filename: "dallas-tx-infographic.webp",
      outputDir: LISTICLE_DIR,
      type: "infographic",
      prompt:
        "Clean modern infographic illustration showing a cross-section of a Dallas Texas ranch-style home attic. Labeled diagram showing heat management in extreme summer climate: radiant barriers, proper ventilation flow, tornado-resistant construction details, and energy efficiency zones. Red and warm brown color palette. Professional flat illustration style. No real photographs.",
      metro: "dallas-tx",
    }
  )

  // ── Atlanta, GA ────────────────────────────────────
  specs.push(
    {
      filename: "best-attic-cleaning-atlanta-ga.webp",
      outputDir: ARTICLES_DIR,
      type: "hero",
      prompt:
        "Professional attic cleaning crew working in a traditional Atlanta Georgia brick home attic. Lush green trees visible through attic vent. Workers in protective gear inspecting for wildlife damage and replacing insulation. Warm natural lighting, photorealistic commercial photography. No text or watermarks.",
      metro: "atlanta-ga",
    },
    {
      filename: "atlanta-ga-wildlife-damage.webp",
      outputDir: LISTICLE_DIR,
      type: "inline",
      prompt:
        "Attic space in Atlanta Georgia home showing squirrel and raccoon damage with torn insulation, nesting materials, and droppings. Professional pest control inspector documenting damage with clipboard. Traditional brick home attic. Photorealistic editorial photography. No text or watermarks.",
      metro: "atlanta-ga",
    },
    {
      filename: "atlanta-ga-restored-attic.webp",
      outputDir: LISTICLE_DIR,
      type: "inline",
      prompt:
        "Beautifully restored attic in an Atlanta Georgia home after professional wildlife cleanup and decontamination. Fresh fiberglass batt insulation installed between joists, sealed entry points, and clean wood surfaces. Photorealistic commercial photography. No text or watermarks.",
      metro: "atlanta-ga",
    },
    {
      filename: "atlanta-ga-infographic.webp",
      outputDir: LISTICLE_DIR,
      type: "infographic",
      prompt:
        "Clean modern infographic illustration showing a cross-section of a traditional Atlanta Georgia home attic. Labeled diagram showing humidity control, wildlife entry prevention points for squirrels and raccoons, proper insulation for humid subtropical climate, and mold prevention strategies. Green and warm brick-red color palette. Professional flat illustration style. No real photographs.",
      metro: "atlanta-ga",
    }
  )

  return specs
}

// ─── Image Generation ───────────────────────────────────

async function generateImage(spec: ImageSpec): Promise<boolean> {
  const outputPath = resolve(spec.outputDir, spec.filename)

  if (existsSync(outputPath)) {
    console.log(`  ⏭  Skipping (exists): ${spec.filename}`)
    return true
  }

  // Ensure output directory exists
  mkdirSync(dirname(outputPath), { recursive: true })

  console.log(`  🎨 Generating: ${spec.filename}`)
  console.log(`     Type: ${spec.type} | Metro: ${spec.metro}`)

  try {
    const response = await ai.models.generateImages({
      model: MODEL,
      prompt: spec.prompt,
      config: {
        numberOfImages: 1,
        aspectRatio: spec.type === "infographic" ? "1:1" : "16:9",
      },
    })

    const imageData = response?.generatedImages?.[0]?.image?.imageBytes
    if (!imageData) {
      console.error(`  ❌ No image data returned for ${spec.filename}`)
      return false
    }

    // Write PNG first, then convert to WebP
    const pngPath = outputPath.replace(/\.webp$/, ".png")
    const buffer = Buffer.from(imageData, "base64")
    writeFileSync(pngPath, buffer)
    console.log(`     PNG: ${(buffer.length / 1024).toFixed(0)} KB`)

    // Convert to WebP
    try {
      execSync(`cwebp -q 85 "${pngPath}" -o "${outputPath}"`, {
        stdio: "pipe",
      })
      // Remove temporary PNG
      execSync(`rm "${pngPath}"`, { stdio: "pipe" })
      console.log(`  ✅ ${spec.filename}`)
    } catch {
      // cwebp not available — keep as PNG and rename
      console.log(`  ⚠️  cwebp not found, keeping PNG as ${spec.filename}`)
      execSync(`mv "${pngPath}" "${outputPath}"`)
    }

    return true
  } catch (err) {
    console.error(
      `  ❌ Failed: ${spec.filename} — ${err instanceof Error ? err.message : err}`
    )
    return false
  }
}

// ─── CLI ────────────────────────────────────────────────

async function main() {
  const manifest = buildImageManifest()

  // Parse CLI arguments
  let selectedMetro: string | null = null
  let selectedType: string | null = null

  for (let i = 2; i < process.argv.length; i++) {
    if (process.argv[i] === "--metro" && process.argv[i + 1]) {
      selectedMetro = process.argv[++i]
    } else if (process.argv[i] === "--type" && process.argv[i + 1]) {
      selectedType = process.argv[++i]
    }
  }

  let images = manifest
  if (selectedMetro) {
    images = images.filter((img) => img.metro === selectedMetro)
  }
  if (selectedType) {
    images = images.filter((img) => img.type === selectedType)
  }

  if (images.length === 0) {
    console.error("No images match the specified filters.")
    console.error(`Available metros: ${METROS.join(", ")}`)
    console.error("Available types: hero, inline, infographic")
    process.exit(1)
  }

  console.log(`\n🖼  Generating ${images.length} images...\n`)

  let success = 0
  let failed = 0

  for (const spec of images) {
    const ok = await generateImage(spec)
    if (ok) success++
    else failed++

    // Rate limiting — 500ms between API calls
    await new Promise((r) => setTimeout(r, 500))
  }

  console.log(`\n${"═".repeat(50)}`)
  console.log(`  Image Generation Summary`)
  console.log(`${"═".repeat(50)}`)
  console.log(`  Total: ${images.length}`)
  console.log(`  Success: ${success}`)
  console.log(`  Failed: ${failed}`)
  console.log(`${"═".repeat(50)}\n`)
}

main().catch((e) => {
  console.error("Image generation failed:", e)
  process.exit(1)
})
