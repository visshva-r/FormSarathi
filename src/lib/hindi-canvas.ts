const MAX_WIDTH = 480;
const FONT_SIZE = 16;
const LINE_HEIGHT = 1.45;
const PADDING = 12;

function devanagariFamily(): string {
  const fromVar = getComputedStyle(document.documentElement)
    .getPropertyValue("--font-noto-devanagari")
    .trim();
  if (fromVar) return fromVar;
  return getComputedStyle(document.body).fontFamily;
}

function wrapLines(ctx: CanvasRenderingContext2D, text: string, maxWidth: number): string[] {
  const words = text.split(/\s+/);
  const lines: string[] = [];
  let current = "";
  for (const word of words) {
    const next = current ? `${current} ${word}` : word;
    if (ctx.measureText(next).width > maxWidth && current) {
      lines.push(current);
      current = word;
    } else {
      current = next;
    }
  }
  if (current) lines.push(current);
  return lines.length ? lines : [text];
}

export async function ensureDevanagariFont(): Promise<void> {
  const family = devanagariFamily();
  await document.fonts.load(`400 ${FONT_SIZE}px ${family}`);
  await document.fonts.ready;
}

/** Render Devanagari for embedding in jsPDF (crisp on screen + video). */
export async function renderDevanagariBlock(text: string): Promise<{
  dataUrl: string;
  widthPx: number;
  heightPx: number;
}> {
  await ensureDevanagariFont();
  const family = devanagariFamily();
  const measure = document.createElement("canvas").getContext("2d")!;
  measure.font = `400 ${FONT_SIZE}px ${family}`;
  const lines = wrapLines(measure, text, MAX_WIDTH);
  const linePx = FONT_SIZE * LINE_HEIGHT;
  const widthPx = MAX_WIDTH + PADDING * 2;
  const heightPx = Math.ceil(PADDING * 2 + lines.length * linePx);

  const canvas = document.createElement("canvas");
  canvas.width = widthPx;
  canvas.height = heightPx;
  const ctx = canvas.getContext("2d")!;
  ctx.fillStyle = "#ffffff";
  ctx.fillRect(0, 0, widthPx, heightPx);
  ctx.fillStyle = "#0f172a";
  ctx.font = `400 ${FONT_SIZE}px ${family}`;
  ctx.textBaseline = "top";
  lines.forEach((line, i) => {
    ctx.fillText(line, PADDING, PADDING + i * linePx);
  });

  return {
    dataUrl: canvas.toDataURL("image/png"),
    widthPx,
    heightPx,
  };
}