"""Generate 5-slide final pitch deck. Run: python scripts/generate_final_deck.py"""
from pptx import Presentation
from pptx.util import Inches, Pt
from pptx.dml.color import RGBColor
from pptx.enum.shapes import MSO_SHAPE
from pptx.enum.text import PP_ALIGN
import os

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
OUT = os.path.join(ROOT, "FormSarathi_Final_5_Slides.pptx")
NAVY = RGBColor(0x0B, 0x2E, 0x3A)
TEAL = RGBColor(0x0F, 0x6B, 0x6B)
INK = RGBColor(0x14, 0x1C, 0x1F)
WHITE = RGBColor(0xFF, 0xFF, 0xFF)
LIGHT = RGBColor(0xF4, 0xF7, 0xF7)

prs = Presentation()
prs.slide_width = Inches(13.333)
prs.slide_height = Inches(7.5)

SLIDES = [
    ("Problem", "India's form barrier", [
        "Dense English/legal wording on govt, bank, college, scheme forms",
        "Rejections from name/doc mismatches — not lack of internet",
        "Target: first-gen students, semi-urban applicants, family helpers",
    ]),
    ("Solution", "FormSarathi pipeline", [
        "Upload or sample → Explain (EN/HI) → Checklist → Draft PDF",
        "Rejection Guard: cross-check draft vs ID spelling",
        "USP: structured artifacts, not generic chat",
    ]),
    ("Features", "Final showcase", [
        "Gemini 2.5 Flash live upload + 5 sample forms",
        "Read aloud, WhatsApp checklist share, official portal links",
        "Editable draft PDF; Verify tab with match/typo/mismatch",
        "Privacy: no server storage; Clear results",
    ]),
    ("Technical", "Architecture", [
        "Next.js on Vercel, API route /api/analyze",
        "Gemini vision → JSON schema → client tabs",
        "Deterministic matcher (Levenshtein) for Rejection Guard",
        "docs/TECHNICAL.md on GitHub",
    ]),
    ("Future scope", "Impact", [
        "More regional languages; Devanagari PDF",
        "DigiLocker / OCR pre-processing; CSC operator mode",
        "Beneficiaries: students, citizens, elderly helpers",
        "Live: formsarathi.vercel.app",
    ]),
]

for section, title, bullets in SLIDES:
    s = prs.slides.add_slide(prs.slide_layouts[6])
    s.shapes.add_shape(MSO_SHAPE.RECTANGLE, 0, 0, Inches(13.333), Inches(7.5)).fill.solid()
    s.shapes[-1].fill.fore_color.rgb = LIGHT
    s.shapes[-1].line.fill.background()
    bar = s.shapes.add_shape(MSO_SHAPE.RECTANGLE, 0, 0, Inches(0.15), Inches(7.5))
    bar.fill.solid()
    bar.fill.fore_color.rgb = TEAL
    bar.line.fill.background()
    box = s.shapes.add_textbox(Inches(0.6), Inches(0.5), Inches(12), Inches(6.5))
    tf = box.text_frame
    tf.word_wrap = True
    p = tf.paragraphs[0]
    p.text = section.upper()
    p.font.size = Pt(14)
    p.font.bold = True
    p.font.color.rgb = TEAL
    p2 = tf.add_paragraph()
    p2.text = title
    p2.font.size = Pt(36)
    p2.font.bold = True
    p2.font.color.rgb = NAVY
    p2.space_after = Pt(18)
    for b in bullets:
        bp = tf.add_paragraph()
        bp.text = f"• {b}"
        bp.font.size = Pt(18)
        bp.font.color.rgb = INK
        bp.space_after = Pt(8)
    foot = s.shapes.add_textbox(Inches(0.6), Inches(6.9), Inches(12), Inches(0.4))
    foot.text_frame.paragraphs[0].text = "FormSarathi · CodeQuest 2026 Final · [Your name]"
    foot.text_frame.paragraphs[0].font.size = Pt(11)
    foot.text_frame.paragraphs[0].font.color.rgb = INK

prs.save(OUT)
print("Saved", OUT)