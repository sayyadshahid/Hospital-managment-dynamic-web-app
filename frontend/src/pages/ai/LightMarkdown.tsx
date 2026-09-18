import React from "react";
import { C } from "./theme";

type Token = { type: "text" | "bold" | "italic" | "code" | "link"; value: string; href?: string };

function tokenizeInline(text: string): Token[] {
  const tokens: Token[] = [];
  const pattern =
    /(\*\*[^*]+\*\*)|(\*[^*]+\*)|(`[^`]+`)|(\[[^\]]+\]\([^)]+\))/g;
  let lastIndex = 0;
  let match: RegExpExecArray | null;
  while ((match = pattern.exec(text)) !== null) {
    if (match.index > lastIndex) {
      tokens.push({ type: "text", value: text.slice(lastIndex, match.index) });
    }
    if (match[1]) {
      tokens.push({ type: "bold", value: match[1].slice(2, -2) });
    } else if (match[2]) {
      tokens.push({ type: "italic", value: match[2].slice(1, -1) });
    } else if (match[3]) {
      tokens.push({ type: "code", value: match[3].slice(1, -1) });
    } else if (match[4]) {
      const inner = match[4];
      const labelEnd = inner.indexOf("](");
      const label = inner.slice(1, labelEnd);
      const href = inner.slice(labelEnd + 2, -1);
      tokens.push({ type: "link", value: label, href });
    }
    lastIndex = pattern.lastIndex;
  }
  if (lastIndex < text.length) {
    tokens.push({ type: "text", value: text.slice(lastIndex) });
  }
  return tokens;
}

function Inline({ text }: { text: string }) {
  return (
    <>
      {tokenizeInline(text).map((token, i) => {
        switch (token.type) {
          case "bold":
            return (
              <strong key={i} style={{ fontWeight: 700 }}>
                <Inline text={token.value} />
              </strong>
            );
          case "italic":
            return (
              <em key={i}>
                <Inline text={token.value} />
              </em>
            );
          case "code":
            return (
              <code
                key={i}
                style={{
                  fontFamily: "monospace",
                  fontSize: "0.85em",
                  background: "#f3f4f6",
                  color: "#b91c1c",
                  padding: "1px 5px",
                  borderRadius: 6,
                }}
              >
                {token.value}
              </code>
            );
          case "link":
            return (
              <a
                key={i}
                href={token.href}
                target="_blank"
                rel="noreferrer"
                style={{ color: C.primary, textDecoration: "underline" }}
              >
                {token.value}
              </a>
            );
          default:
            return <React.Fragment key={i}>{token.value}</React.Fragment>;
        }
      })}
    </>
  );
}

function isOrderedList(lines: string[]): boolean {
  return lines.some((line) => /^\s*\d+\.\s+/.test(line));
}

function LightMarkdown({ text }: { text: string }) {
  const lines = text.split("\n");
  const blocks: React.ReactNode[] = [];
  let i = 0;
  let key = 0;

  while (i < lines.length) {
    const line = lines[i];
    const trimmed = line.trim();

    if (!trimmed) {
      i += 1;
      continue;
    }

    if (/^\s*```/.test(trimmed)) {
      const codeLines: string[] = [];
      i += 1;
      while (i < lines.length && !/^\s*```/.test(lines[i])) {
        codeLines.push(lines[i]);
        i += 1;
      }
      i += 1; // closing fence
      blocks.push(
        <pre
          key={key++}
          style={{
            background: "#111827",
            color: "#f9fafb",
            padding: "12px 14px",
            borderRadius: 12,
            overflowX: "auto",
            fontSize: "0.85rem",
            lineHeight: 1.6,
            fontFamily: "monospace",
          }}
        >
          {codeLines.join("\n")}
        </pre>
      );
      continue;
    }

    if (/^#{1,6}\s+/.test(trimmed)) {
      const level = trimmed.match(/^#+/)?.[0].length ?? 1;
      const content = trimmed.replace(/^#+\s+/, "");
      const Tag = (["h1", "h2", "h3", "h4", "h5", "h6"] as const)[
        Math.min(level - 1, 5)
      ];
      blocks.push(
        <Tag
          key={key++}
          style={{
            fontWeight: 700,
            fontSize:
              level === 1
                ? "1.35rem"
                : level === 2
                  ? "1.15rem"
                  : level === 3
                    ? "1.02rem"
                    : "0.95rem",
            margin: "14px 0 6px",
            color: "#111827",
          }}
        >
          <Inline text={content} />
        </Tag>
      );
      i += 1;
      continue;
    }

    if (/^\s*[-*]\s+/.test(trimmed)) {
      const items: string[] = [];
      while (i < lines.length && /^\s*[-*]\s+/.test(lines[i])) {
        items.push(lines[i].replace(/^\s*[-*]\s+/, ""));
        i += 1;
      }
      blocks.push(
        <ul
          key={key++}
          style={{ margin: "8px 0", paddingLeft: 22, display: "grid", gap: 4 }}
        >
          {items.map((item, idx) => (
            <li key={idx} style={{ lineHeight: 1.6 }}>
              <Inline text={item} />
            </li>
          ))}
        </ul>
      );
      continue;
    }

    if (/^\s*\d+\.\s+/.test(trimmed)) {
      const items: string[] = [];
      const isNumbered = isOrderedList(lines.slice(i));
      while (
        i < lines.length &&
        /^\s*\d+\.\s+|\s*[-*]\s+/.test(lines[i]) &&
        isNumbered === /^\s*\d+\.\s+/.test(lines[i])
      ) {
        items.push(lines[i].replace(/^\s*(\d+\.|[-*])\s+/, ""));
        i += 1;
      }
      blocks.push(
        <ol
          key={key++}
          style={{ margin: "8px 0", paddingLeft: 22, display: "grid", gap: 4 }}
        >
          {items.map((item, idx) => (
            <li key={idx} style={{ lineHeight: 1.6 }}>
              <Inline text={item} />
            </li>
          ))}
        </ol>
      );
      continue;
    }

    if (/^\s*---+\s*$/.test(trimmed)) {
      blocks.push(
        <hr
          key={key++}
          style={{ border: "none", borderTop: `1px solid ${C.border}`, margin: "12px 0" }}
        />
      );
      i += 1;
      continue;
    }

    blocks.push(
      <p key={key++} style={{ margin: "6px 0", lineHeight: 1.65 }}>
        <Inline text={trimmed} />
      </p>
    );
    i += 1;
  }

  return (
    <div style={{ fontSize: "0.95rem", color: "#1f2937" }}>{blocks}</div>
  );
}

export default LightMarkdown;