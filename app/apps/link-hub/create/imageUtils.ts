export function fileToDataUrl(
  file: File
): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = () => {
      if (typeof reader.result === "string") {
        resolve(reader.result);
        return;
      }

      reject(
        new Error("Could not read the selected file.")
      );
    };

    reader.onerror = () => {
      reject(
        reader.error ??
          new Error("Could not read the selected file.")
      );
    };

    reader.readAsDataURL(file);
  });
}

function loadImage(
  source: string
): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const image = new Image();

    image.onload = () => {
      resolve(image);
    };

    image.onerror = () => {
      reject(
        new Error("Could not process the selected image.")
      );
    };

    image.src = source;
  });
}

export async function fileToPersistentImageUrl(
  file: File,
  options?: {
    maxDimension?: number;
    quality?: number;
  }
): Promise<string> {
  const original = await fileToDataUrl(file);

  if (!file.type.startsWith("image/")) {
    return original;
  }

  if (
    file.type === "image/svg+xml" ||
    file.type === "image/gif"
  ) {
    return original;
  }

  try {
    const image = await loadImage(original);

    const maxDimension =
      options?.maxDimension ?? 1600;

    const quality =
      options?.quality ?? 0.86;

    const scale = Math.min(
      1,
      maxDimension /
        Math.max(image.width, image.height)
    );

    const width = Math.max(
      1,
      Math.round(image.width * scale)
    );

    const height = Math.max(
      1,
      Math.round(image.height * scale)
    );

    const canvas =
      document.createElement("canvas");

    canvas.width = width;
    canvas.height = height;

    const context =
      canvas.getContext("2d");

    if (!context) {
      return original;
    }

    context.drawImage(
      image,
      0,
      0,
      width,
      height
    );

    return canvas.toDataURL(
      "image/webp",
      quality
    );
  } catch {
    return original;
  }
}
