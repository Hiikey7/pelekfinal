import { createHash } from "node:crypto";

type UploadRequest = {
  bucket?: string;
  path?: string;
  file?: string;
};

function requireAdmin(req: any) {
  const auth = req.headers.authorization || "";
  const token = auth.startsWith("Bearer ") ? auth.slice(7) : "";
  return !!process.env.ADMIN_SESSION_SECRET && token === process.env.ADMIN_SESSION_SECRET;
}

function cloudinaryFolder(bucket?: string) {
  const baseFolder = process.env.CLOUDINARY_FOLDER || "pelek-home-hub";
  const safeBucket = (bucket || "uploads").replace(/[^a-z0-9-_]/gi, "-");
  return `${baseFolder}/${safeBucket}`;
}

export default async function handler(req: any, res: any) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: { message: "Method not allowed" } });
  }

  if (!requireAdmin(req)) {
    return res.status(401).json({ error: { message: "Unauthorized" } });
  }

  const cloudName = process.env.CLOUDINARY_CLOUD_NAME;
  const apiKey = process.env.CLOUDINARY_API_KEY;
  const apiSecret = process.env.CLOUDINARY_API_SECRET;

  if (!cloudName || !apiKey || !apiSecret) {
    return res.status(500).json({
      error: {
        message:
          "Cloudinary is not configured. Set CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, and CLOUDINARY_API_SECRET.",
      },
    });
  }

  const { bucket, path, file } = (req.body || {}) as UploadRequest;
  if (!file || !path) {
    return res
      .status(400)
      .json({ error: { message: "Upload path and file are required" } });
  }

  try {
    const timestamp = Math.floor(Date.now() / 1000);
    const publicId = path.replace(/\.[^.]+$/, "").replace(/[^a-z0-9-_/.]/gi, "-");
    const folder = cloudinaryFolder(bucket);
    const transformation = "f_auto,q_auto:good,c_limit,w_1800,h_1800";
    const toSign = `folder=${folder}&public_id=${publicId}&timestamp=${timestamp}&transformation=${transformation}${apiSecret}`;
    const signature = createHash("sha1").update(toSign).digest("hex");

    const form = new FormData();
    form.set("file", file);
    form.set("api_key", apiKey);
    form.set("timestamp", String(timestamp));
    form.set("signature", signature);
    form.set("folder", folder);
    form.set("public_id", publicId);
    form.set("transformation", transformation);

    const response = await fetch(
      `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`,
      {
        method: "POST",
        body: form,
      },
    );

    const result = await response.json();
    if (!response.ok) {
      throw new Error(result.error?.message || "Cloudinary upload failed");
    }

    return res.status(200).json({
      path,
      publicUrl: result.secure_url,
      width: result.width,
      height: result.height,
      bytes: result.bytes,
      format: result.format,
    });
  } catch (error) {
    return res.status(400).json({
      error: {
        message: error instanceof Error ? error.message : "Upload failed",
      },
    });
  }
}
