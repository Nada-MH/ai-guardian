import re

def clean_text(text: str) -> str:
    """Sanitize and normalize raw text extracted from documents."""
    if not text:
        return ""
    # Normalize line breaks and multiple spaces
    text = re.sub(r"\r\n|\r", "\n", text)
    text = re.sub(r"\n{3,}", "\n\n", text)
    text = re.sub(r"[ \t]{2,}", " ", text)
    # Remove non-printable control characters (except newlines and tabs)
    text = re.sub(r"[\x00-\x08\x0b\x0c\x0e-\x1f\x7f-\x9f]", "", text)
    return text.strip()

def format_markdown_table(headers: list, rows: list) -> str:
    """Convert raw table headers and rows into clean GitHub-flavored Markdown table format."""
    if not headers or not rows:
        return ""
    header_line = "| " + " | ".join(str(h) for h in headers) + " |"
    separator_line = "| " + " | ".join("---" for _ in headers) + " |"
    row_lines = ["| " + " | ".join(str(cell) for cell in row) + " |" for row in rows]
    return "\n".join([header_line, separator_line] + row_lines)
