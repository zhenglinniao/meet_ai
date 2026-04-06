export function normalizeOpenAiUrl(url?: string) {
  if (!url) {
    return "https://api.openai.com";
  }
  return url.replace(/\/+$/, "");
}

export function parseOpenAiHeaders(headerString?: string) {
  const headers: Record<string, string> = {};
  if (!headerString) {
    return headers;
  }
  headerString.split(";").forEach((pair) => {
    const [key, value] = pair.split("=").map((part) => part.trim());
    if (key && value) {
      headers[key] = value;
    }
  });
  return headers;
}

export function getOpenAiConfig() {
  return {
    baseUrl: normalizeOpenAiUrl(process.env.OPENAI_BASE_URL),
    headers: parseOpenAiHeaders(process.env.OPENAI_DEFAULT_HEADERS),
  };
}
