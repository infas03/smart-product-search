interface HighlightedTextProps {
  text: string;
  query: string;
}

function HighlightedText({ text, query }: HighlightedTextProps) {
  if (!query.trim()) return <span>{text}</span>;

  const words = query.trim().split(/\s+/).filter(Boolean);
  const pattern = new RegExp(`(${words.map(escapeRegex).join("|")})`, "gi");
  const parts = text.split(pattern);

  return (
    <span>
      {parts.map((part, index) => {
        const isMatch = words.some(
          (word) => part.toLowerCase() === word.toLowerCase()
        );
        return isMatch ? (
          <mark key={index} className="bg-amber-100 text-gray-900 rounded-sm px-0.5">
            {part}
          </mark>
        ) : (
          <span key={index}>{part}</span>
        );
      })}
    </span>
  );
}

function escapeRegex(input: string): string {
  return input.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

export default HighlightedText;
