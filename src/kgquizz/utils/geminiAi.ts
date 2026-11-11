/**
 * Client service to communicate with backend Gemini API routes for:
 * 1. Realistic female text-to-speech (TTS) for English and Urdu
 * 2. Kindergarten storybook AI image generation
 */

export interface GenerateTtsResult {
  success: boolean;
  audioUrl?: string;
  error?: string;
}

export interface GenerateImageResult {
  success: boolean;
  imageUrl?: string;
  error?: string;
}

/**
 * Generate a realistic female voice speech audio for English or Urdu using Gemini TTS
 */
export async function generateGeminiVoice(
  text: string,
  lang: 'en' | 'ur' = 'en',
  voiceName: 'Kore' | 'Aoede' = 'Kore',
  customStyle?: string
): Promise<GenerateTtsResult> {
  try {
    const response = await fetch('/api/ai/tts', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        text,
        lang,
        voiceName,
        style: customStyle,
      }),
    });

    const data = await response.json();

    if (!response.ok || !data.success) {
      return {
        success: false,
        error: data.error || 'Failed to generate voice with Gemini API.',
      };
    }

    return {
      success: true,
      audioUrl: data.audioUrl,
    };
  } catch (err: any) {
    return {
      success: false,
      error: err?.message || 'Network error while contacting voice generation server.',
    };
  }
}

/**
 * Generate a custom kindergarten storybook image using Gemini API
 */
export async function generateGeminiImage(
  prompt: string,
  subject: string = 'general'
): Promise<GenerateImageResult> {
  try {
    const response = await fetch('/api/ai/generate-image', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        prompt,
        subject,
      }),
    });

    const data = await response.json();

    if (!response.ok || !data.success) {
      return {
        success: false,
        error: data.error || 'Failed to generate image with Gemini API.',
      };
    }

    return {
      success: true,
      imageUrl: data.imageUrl,
    };
  } catch (err: any) {
    return {
      success: false,
      error: err?.message || 'Network error while generating image.',
    };
  }
}
