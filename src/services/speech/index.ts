import RNFS from 'react-native-fs';
import { API_URL } from '@env';
import { getHeaders } from '@/lib/fetch';
import type { SupportedLanguage } from '@/i18n';

const CACHE_DIR = `${RNFS.CachesDirectoryPath}/tts`;

// Bypasses lib/fetch.ts's request()/download() helpers on purpose: request()
// always calls response.json() (this endpoint returns binary audio), and
// download() doesn't attach the device-token header and relies on
// URL.createObjectURL, which isn't usable in React Native.
export async function getSpeechFileUri(
  messageId: string,
  lang: SupportedLanguage,
): Promise<string> {
  const path = `${CACHE_DIR}/${messageId}-${lang}.mp3`;

  if (await RNFS.exists(path)) {
    return `file://${path}`;
  }

  await RNFS.mkdir(CACHE_DIR);

  const headers = await getHeaders(lang);
  const { statusCode } = await RNFS.downloadFile({
    fromUrl: `${API_URL}/messages/${messageId}/speech`,
    toFile: path,
    headers: headers as Record<string, string>,
  }).promise;

  if (statusCode >= 400) {
    await RNFS.unlink(path).catch(() => undefined);
    throw new Error(`Failed to fetch speech audio: status ${statusCode}`);
  }

  return `file://${path}`;
}
