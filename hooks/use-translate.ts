import { useCallback } from 'react';

const TRANSLATION_CACHE: { [key: string]: { [key: string]: string } } = {};

export function useTranslate() {
  const translateText = useCallback(async (text: string, targetLang: string) => {
    const cacheKey = `${text}_${targetLang}`;
    
    // Check cache first
    if (TRANSLATION_CACHE[text] && TRANSLATION_CACHE[text][targetLang]) {
      return TRANSLATION_CACHE[text][targetLang];
    }

    try {
      // For development/demo, using a simple translation map
      const demoTranslations: { [key: string]: { [key: string]: string } } = {
        'Hello': {
          'zh': '你好',
          'ms': 'Hello',
          'fr': 'Bonjour'
        },
        'Settings': {
          'zh': '设置',
          'ms': 'Tetapan',
          'fr': 'Paramètres'
        },
        // Add more common translations here
      };

      // In production, you would use a translation API like Google Translate:
      // const response = await fetch(`your-translation-api-endpoint`, {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify({ text, targetLang })
      // });
      // const result = await response.json();
      // const translatedText = result.translatedText;

      // For demo, use the demo translations or return original text
      const translatedText = demoTranslations[text]?.[targetLang] || text;

      // Cache the result
      if (!TRANSLATION_CACHE[text]) {
        TRANSLATION_CACHE[text] = {};
      }
      TRANSLATION_CACHE[text][targetLang] = translatedText;

      return translatedText;
    } catch (error) {
      console.error('Translation error:', error);
      return text; // Return original text if translation fails
    }
  }, []);

  return { translateText };
}
