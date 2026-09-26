const STORAGE_KEY = 'card_scanner_gemini_api_key';

export function getStoredApiKey(): string {
  try {
    return localStorage.getItem(STORAGE_KEY) || '';
  } catch {
    return '';
  }
}

export function setStoredApiKey(key: string): void {
  try {
    if (key.trim()) {
      localStorage.setItem(STORAGE_KEY, key.trim());
    } else {
      localStorage.removeItem(STORAGE_KEY);
    }
  } catch (err) {
    console.warn(err);
  }
}

export async function verifyApiKey(key: string): Promise<{ valid: boolean; error?: string }> {
  try {
    const res = await fetch('/api/verify-gemini-key', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-gemini-api-key': key.trim(),
      },
      body: JSON.stringify({ apiKey: key.trim() }),
    });

    const data = await res.json();
    if (!res.ok || !data.valid) {
      return { valid: false, error: data.error || 'APIキーの検証に失敗しました。' };
    }

    return { valid: true };
  } catch (err: any) {
    // If backend is offline, try client-side validation
    try {
      const { GoogleGenAI } = await import('@google/genai');
      const ai = new GoogleGenAI({ apiKey: key.trim() });
      await ai.models.generateContent({
        model: 'gemini-3.1-flash-lite',
        contents: 'test',
      });
      return { valid: true };
    } catch (clientErr: any) {
      return { valid: false, error: clientErr.message || 'APIキーが無効です。' };
    }
  }
}
