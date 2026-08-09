from pypdf import PdfReader
from pathlib import Path

path = Path('viren_resume_latex.pdf')
reader = PdfReader(str(path))
text = '\n'.join(page.extract_text() or '' for page in reader.pages)
print(text)
