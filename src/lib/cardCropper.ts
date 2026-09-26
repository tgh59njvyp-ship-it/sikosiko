/**
 * AI & Computer Vision Card Auto-Cropper Engine
 * Automatically detects card boundaries from camera captures or uploaded photos,
 * removes the background (table, mat, hands), corrects aspect ratio (63:88 standard TCG ratio),
 * and generates a high-definition cropped card portrait for the collection binder.
 */

export interface CropRect {
  x: number; // 0 to 1 normalized
  y: number; // 0 to 1 normalized
  width: number; // 0 to 1 normalized
  height: number; // 0 to 1 normalized
}

export interface AutoCropResult {
  croppedBase64: string;
  originalBase64: string;
  bounds: CropRect;
  aspectRatio: number;
}

/**
 * Loads an image from a base64 or URL string into an HTMLImageElement
 */
function loadImage(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => resolve(img);
    img.onerror = (err) => reject(err);
    img.src = src;
  });
}

/**
 * Detects card boundaries in an image using luminosity/contrast gradient analysis
 */
export async function detectAndCropCard(imageBase64: string): Promise<AutoCropResult> {
  try {
    const img = await loadImage(imageBase64);
    const width = img.naturalWidth || img.width;
    const height = img.naturalHeight || img.height;

    // If image is already SVG or very small, return as is with standard bounds
    if (imageBase64.includes('image/svg+xml') || width < 100 || height < 100) {
      return {
        croppedBase64: imageBase64,
        originalBase64: imageBase64,
        bounds: { x: 0, y: 0, width: 1, height: 1 },
        aspectRatio: width / height,
      };
    }

    // Downscale for fast edge detection analysis
    const sampleCanvas = document.createElement('canvas');
    const sw = Math.min(400, width);
    const sh = Math.round((height / width) * sw);
    sampleCanvas.width = sw;
    sampleCanvas.height = sh;

    const ctx = sampleCanvas.getContext('2d');
    if (!ctx) {
      return {
        croppedBase64: imageBase64,
        originalBase64: imageBase64,
        bounds: { x: 0.05, y: 0.05, width: 0.9, height: 0.9 },
        aspectRatio: 63 / 88,
      };
    }

    ctx.drawImage(img, 0, 0, sw, sh);
    const imgData = ctx.getImageData(0, 0, sw, sh);
    const pixels = imgData.data;

    // Compute luminance array
    const luma = new Float32Array(sw * sh);
    for (let i = 0; i < pixels.length; i += 4) {
      luma[i / 4] = (pixels[i] * 0.299 + pixels[i + 1] * 0.587 + pixels[i + 2] * 0.114) / 255;
    }

    // Row & column gradient variance to find card edges
    const colVariance = new Float32Array(sw);
    const rowVariance = new Float32Array(sh);

    for (let x = 0; x < sw; x++) {
      let diffSum = 0;
      for (let y = 1; y < sh; y++) {
        diffSum += Math.abs(luma[y * sw + x] - luma[(y - 1) * sw + x]);
      }
      colVariance[x] = diffSum / sh;
    }

    for (let y = 0; y < sh; y++) {
      let diffSum = 0;
      for (let x = 1; x < sw; x++) {
        diffSum += Math.abs(luma[y * sw + x] - luma[y * sw + (x - 1)]);
      }
      rowVariance[y] = diffSum / sw;
    }

    // Find boundaries where content starts (inward scan 3% to 35%)
    let minX = Math.round(sw * 0.04);
    let maxX = Math.round(sw * 0.96);
    let minY = Math.round(sh * 0.04);
    let maxY = Math.round(sh * 0.96);

    // Left scan
    for (let x = Math.round(sw * 0.02); x < Math.round(sw * 0.3); x++) {
      if (colVariance[x] > 0.045) {
        minX = x;
        break;
      }
    }
    // Right scan
    for (let x = Math.round(sw * 0.98); x > Math.round(sw * 0.7); x--) {
      if (colVariance[x] > 0.045) {
        maxX = x;
        break;
      }
    }
    // Top scan
    for (let y = Math.round(sh * 0.02); y < Math.round(sh * 0.3); y++) {
      if (rowVariance[y] > 0.045) {
        minY = y;
        break;
      }
    }
    // Bottom scan
    for (let y = Math.round(sh * 0.98); y > Math.round(sh * 0.7); y--) {
      if (rowVariance[y] > 0.045) {
        maxY = y;
        break;
      }
    }

    // Normalized bounds
    let normX = Math.max(0, minX / sw);
    let normY = Math.max(0, minY / sh);
    let normW = Math.min(1 - normX, (maxX - minX) / sw);
    let normH = Math.min(1 - normY, (maxY - minY) / sh);

    // Ensure realistic minimum card dimension
    if (normW < 0.4 || normH < 0.4) {
      normX = 0.04;
      normY = 0.04;
      normW = 0.92;
      normH = 0.92;
    }

    // Target TCG card aspect ratio: 63 / 88 = ~0.7159
    const targetRatio = 63 / 88;
    const currentRatio = (normW * width) / (normH * height);

    // Slightly adjust box to maintain standard card proportion if close
    if (Math.abs(currentRatio - targetRatio) < 0.25) {
      if (currentRatio > targetRatio) {
        // Too wide: trim left & right
        const desiredW = ((normH * height) * targetRatio) / width;
        const diffW = normW - desiredW;
        normX += diffW / 2;
        normW = desiredW;
      } else {
        // Too tall: trim top & bottom
        const desiredH = ((normW * width) / targetRatio) / height;
        const diffH = normH - desiredH;
        normY += diffH / 2;
        normH = desiredH;
      }
    }

    // Perform the high-resolution crop onto high-quality output canvas
    const cropCanvas = document.createElement('canvas');
    const targetOutputWidth = 630;
    const targetOutputHeight = 880;
    cropCanvas.width = targetOutputWidth;
    cropCanvas.height = targetOutputHeight;

    const outCtx = cropCanvas.getContext('2d');
    if (!outCtx) throw new Error('Canvas context not available');

    outCtx.imageSmoothingEnabled = true;
    outCtx.imageSmoothingQuality = 'high';

    // Source coordinates on original image
    const sx = Math.max(0, Math.round(normX * width));
    const sy = Math.max(0, Math.round(normY * height));
    const sWidth = Math.min(width - sx, Math.round(normW * width));
    const sHeight = Math.min(height - sy, Math.round(normH * height));

    outCtx.drawImage(img, sx, sy, sWidth, sHeight, 0, 0, targetOutputWidth, targetOutputHeight);

    const croppedBase64 = cropCanvas.toDataURL('image/jpeg', 0.92);

    return {
      croppedBase64,
      originalBase64: imageBase64,
      bounds: { x: normX, y: normY, width: normW, height: normH },
      aspectRatio: targetRatio,
    };
  } catch (err) {
    console.warn('Auto-crop fallback error:', err);
    return {
      croppedBase64: imageBase64,
      originalBase64: imageBase64,
      bounds: { x: 0, y: 0, width: 1, height: 1 },
      aspectRatio: 63 / 88,
    };
  }
}

/**
 * Manually crop an image with custom normalized bounding box coordinates
 */
export async function cropImageWithBounds(imageBase64: string, bounds: CropRect): Promise<string> {
  const img = await loadImage(imageBase64);
  const width = img.naturalWidth || img.width;
  const height = img.naturalHeight || img.height;

  const canvas = document.createElement('canvas');
  const targetOutputWidth = 630;
  const targetOutputHeight = 880;
  canvas.width = targetOutputWidth;
  canvas.height = targetOutputHeight;

  const ctx = canvas.getContext('2d');
  if (!ctx) return imageBase64;

  ctx.imageSmoothingEnabled = true;
  ctx.imageSmoothingQuality = 'high';

  const sx = Math.max(0, Math.round(bounds.x * width));
  const sy = Math.max(0, Math.round(bounds.y * height));
  const sWidth = Math.min(width - sx, Math.round(bounds.width * width));
  const sHeight = Math.min(height - sy, Math.round(bounds.height * height));

  ctx.drawImage(img, sx, sy, sWidth, sHeight, 0, 0, targetOutputWidth, targetOutputHeight);

  return canvas.toDataURL('image/jpeg', 0.92);
}

/**
 * Rotate an image by 90 degrees clockwise
 */
export async function rotateImage90(imageBase64: string): Promise<string> {
  const img = await loadImage(imageBase64);
  const canvas = document.createElement('canvas');
  canvas.width = img.naturalHeight || img.height;
  canvas.height = img.naturalWidth || img.width;

  const ctx = canvas.getContext('2d');
  if (!ctx) return imageBase64;

  ctx.translate(canvas.width / 2, canvas.height / 2);
  ctx.rotate((90 * Math.PI) / 180);
  ctx.drawImage(img, -img.width / 2, -img.height / 2);

  return canvas.toDataURL('image/jpeg', 0.92);
}
