import { authenticatedUser, unauthorized, ownedProfile } from "@/lib/linkHubAuth";
import { NextResponse } from "next/server";

export const runtime = "nodejs";

const BUCKET_NAME = "link-hub-media";
const MAX_FILE_SIZE = 8 * 1024 * 1024;

const ALLOWED_IMAGE_TYPES = new Set([
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/gif",
  "image/avif",
]);

function normalizeUsername(value: string) {
  return value
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9-_]/g, "")
    .replace(/^-+|-+$/g, "");
}

function getExtension(file: File) {
  const fromName =
    file.name
      .split(".")
      .pop()
      ?.toLowerCase()
      .replace(/[^a-z0-9]/g, "") || "";

  if (fromName) {
    return fromName.slice(0, 10);
  }

  if (file.type === "image/jpeg") return "jpg";
  if (file.type === "image/png") return "png";
  if (file.type === "image/webp") return "webp";
  if (file.type === "image/gif") return "gif";
  if (file.type === "image/avif") return "avif";

  return "bin";
}

function encodeStoragePath(path: string) {
  return path
    .split("/")
    .map((part) => encodeURIComponent(part))
    .join("/");
}

export async function POST(request: Request) {
  const userId = await authenticatedUser(request);
  if (!userId) return unauthorized();
  try {
    const formData = await request.formData();

    const rawUsername =
      formData.get("username");

    const fileValue =
      formData.get("file");

    const username =
      typeof rawUsername === "string"
        ? normalizeUsername(rawUsername)
        : "";

    if (!username) {
      return NextResponse.json(
        {
          ok: false,
          error: "A Link Hub username is required.",
        },
        {
          status: 400,
        }
      );
    }

    if (
      !(fileValue instanceof File)
    ) {
      return NextResponse.json(
        {
          ok: false,
          error: "No image file was provided.",
        },
        {
          status: 400,
        }
      );
    }

    if (
      !ALLOWED_IMAGE_TYPES.has(
        fileValue.type
      )
    ) {
      return NextResponse.json(
        {
          ok: false,
          error:
            "Unsupported image type. Use JPG, PNG, WebP, GIF, or AVIF.",
        },
        {
          status: 400,
        }
      );
    }

    if (
      fileValue.size <= 0
    ) {
      return NextResponse.json(
        {
          ok: false,
          error: "The selected image is empty.",
        },
        {
          status: 400,
        }
      );
    }

    if (
      fileValue.size >
      MAX_FILE_SIZE
    ) {
      return NextResponse.json(
        {
          ok: false,
          error:
            "Image is too large. Maximum size is 8 MB.",
        },
        {
          status: 413,
        }
      );
    }

    const supabaseUrl =
      process.env.NEXT_PUBLIC_SUPABASE_URL;

    const secretKey =
      process.env.SUPABASE_SECRET_KEY;

    if (
      !supabaseUrl ||
      !secretKey
    ) {
      console.error(
        "Link Hub upload route is missing Supabase environment variables."
      );

      return NextResponse.json(
        {
          ok: false,
          error:
            "Media storage is not configured yet.",
        },
        {
          status: 503,
        }
      );
    }

    if (!(await ownedProfile(username, userId))) {
      return NextResponse.json({ ok:false, error:"Publish your own Link Hub before uploading media." }, {status:403});
    }

    const extension =
      getExtension(fileValue);

    const storagePath =
      `${username}/${Date.now()}-${crypto.randomUUID()}.${extension}`;

    const encodedPath =
      encodeStoragePath(
        storagePath
      );

    const fileBytes =
      await fileValue.arrayBuffer();

    const uploadResponse =
      await fetch(
        `${supabaseUrl}/storage/v1/object/${BUCKET_NAME}/${encodedPath}`,
        {
          method: "POST",
          headers: {
            apikey: secretKey,
            Authorization: `Bearer ${secretKey}`,
            "Content-Type":
              fileValue.type ||
              "application/octet-stream",
            "x-upsert": "false",
            "cache-control":
              "3600",
          },
          body: fileBytes,
        }
      );

    if (
      !uploadResponse.ok
    ) {
      const message =
        await uploadResponse.text();

      console.error(
        "Supabase Link Hub media upload failed:",
        uploadResponse.status,
        message
      );

      return NextResponse.json(
        {
          ok: false,
          error:
            "Could not upload this image.",
        },
        {
          status: 500,
        }
      );
    }

    const publicUrl =
      `${supabaseUrl}/storage/v1/object/public/${BUCKET_NAME}/${encodedPath}`;

    return NextResponse.json({
      ok: true,
      username,
      path: storagePath,
      url: publicUrl,
      fileName:
        fileValue.name,
      contentType:
        fileValue.type,
      size:
        fileValue.size,
    });
  } catch (error) {
    console.error(
      "Link Hub upload route failed:",
      error
    );

    return NextResponse.json(
      {
        ok: false,
        error:
          "Could not process this image upload.",
      },
      {
        status: 500,
      }
    );
  }
}
