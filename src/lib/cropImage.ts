export type CropArea = {
  x: number;
  y: number;
  width: number;
  height: number;
};

function loadImage(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.onload = () => resolve(img);
    img.onerror = (e) => reject(e);
    img.src = src;
  });
}

export async function getCroppedBlob(
  imageSrc: string,
  area: CropArea,
  mimeType: string = "image/jpeg",
  quality: number = 0.92
): Promise<Blob> {
  const image = await loadImage(imageSrc);

  const canvas = document.createElement("canvas");
  canvas.width = Math.round(area.width);
  canvas.height = Math.round(area.height);

  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("Kunne ikke oprette canvas-kontekst");

  ctx.drawImage(
    image,
    area.x,
    area.y,
    area.width,
    area.height,
    0,
    0,
    area.width,
    area.height
  );

  return new Promise((resolve, reject) => {
    canvas.toBlob(
      (blob) => {
        if (!blob) {
          reject(new Error("Kunne ikke generere billede"));
          return;
        }
        resolve(blob);
      },
      mimeType,
      quality
    );
  });
}
