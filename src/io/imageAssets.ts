/** Live in-memory registry mapping a blob: URL (used directly as a note's
 * `image` field while the app is open) to the underlying Blob, so pasted
 * images can be packed into a saved .gardenplan zip and re-hydrated on load.
 * Plain `Map<string, Blob>` rather than a class so it can live in a `useRef`
 * without any extra ceremony. */
export type ImageAssets = Map<string, Blob>;

export function registerImageBlob(assets: ImageAssets, blob: Blob): string {
  const url = URL.createObjectURL(blob);
  assets.set(url, blob);
  return url;
}

export function releaseImageBlob(assets: ImageAssets, url: string | undefined | null) {
  if (!url || !assets.has(url)) return;
  URL.revokeObjectURL(url);
  assets.delete(url);
}

export function resetImageAssets(assets: ImageAssets) {
  for (const url of assets.keys()) URL.revokeObjectURL(url);
  assets.clear();
}
