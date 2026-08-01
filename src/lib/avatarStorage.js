 import { supabase } from "./supabase.js";

const AVATAR_BUCKET = "avatars";
const MAX_AVATAR_SIZE = 5 * 1024 * 1024;

const ALLOWED_AVATAR_TYPES = [
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/gif",
];

function getFileExtension(file) {
  const extensionFromName = file.name?.split(".").pop()?.toLowerCase();

  if (extensionFromName && extensionFromName !== file.name) {
    return extensionFromName === "jpeg" ? "jpg" : extensionFromName;
  }

  const extensionByType = {
    "image/jpeg": "jpg",
    "image/png": "png",
    "image/webp": "webp",
    "image/gif": "gif",
  };

  return extensionByType[file.type] || "jpg";
}

export function validateAvatarFile(file) {
  if (!file) {
    throw new Error("Please choose a profile picture.");
  }

  if (!ALLOWED_AVATAR_TYPES.includes(file.type)) {
    throw new Error(
      "Please choose a JPG, PNG, WebP, or GIF image.",
    );
  }

  if (file.size > MAX_AVATAR_SIZE) {
    throw new Error("Profile pictures must be 5 MB or smaller.");
  }
}

async function removeExistingAvatarFiles(userId) {
  const { data: existingFiles, error: listError } = await supabase.storage
    .from(AVATAR_BUCKET)
    .list(userId, {
      limit: 100,
    });

  if (listError) {
    throw new Error(listError.message);
  }

  if (!existingFiles?.length) {
    return;
  }

  const filePaths = existingFiles
    .filter((file) => file.name)
    .map((file) => `${userId}/${file.name}`);

  if (!filePaths.length) {
    return;
  }

  const { error: removeError } = await supabase.storage
    .from(AVATAR_BUCKET)
    .remove(filePaths);

  if (removeError) {
    throw new Error(removeError.message);
  }
}

export async function uploadAvatar({ userId, file }) {
  if (!userId) {
    throw new Error("You must be logged in to upload a picture.");
  }

  validateAvatarFile(file);

  await removeExistingAvatarFiles(userId);

  const extension = getFileExtension(file);
  const filePath = `${userId}/avatar-${Date.now()}.${extension}`;

  const { error: uploadError } = await supabase.storage
    .from(AVATAR_BUCKET)
    .upload(filePath, file, {
      cacheControl: "3600",
      upsert: false,
      contentType: file.type,
    });

  if (uploadError) {
    throw new Error(uploadError.message);
  }

  const {
    data: { publicUrl },
  } = supabase.storage.from(AVATAR_BUCKET).getPublicUrl(filePath);

  if (!publicUrl) {
    await supabase.storage.from(AVATAR_BUCKET).remove([filePath]);
    throw new Error("AIWCORE could not create the avatar URL.");
  }

  const { error: profileError } = await supabase
    .from("profiles")
    .update({
      avatar_url: publicUrl,
    })
    .eq("id", userId);

  if (profileError) {
    await supabase.storage.from(AVATAR_BUCKET).remove([filePath]);
    throw new Error(profileError.message);
  }

  return publicUrl;
}

export async function removeAvatar(userId) {
  if (!userId) {
    throw new Error("You must be logged in to remove your picture.");
  }

  await removeExistingAvatarFiles(userId);

  const { error: profileError } = await supabase
    .from("profiles")
    .update({
      avatar_url: null,
    })
    .eq("id", userId);

  if (profileError) {
    throw new Error(profileError.message);
  }
}