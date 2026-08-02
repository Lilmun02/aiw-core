import { supabase } from "./supabase.js";

function normalizeVapidPublicKey(value) {
  if (typeof value !== "string") {
    throw new Error("The push notification public key is missing.");
  }

  const normalized = value
    .trim()
    .replace(/^['"]+|['"]+$/g, "")
    .replace(/,+$/g, "")
    .replace(/\s+/g, "");

  if (!normalized) {
    throw new Error("The push notification public key is empty.");
  }

  if (!/^[A-Za-z0-9_-]+$/.test(normalized)) {
    throw new Error(
      "The push notification public key contains invalid characters.",
    );
  }

  return normalized;
}

function urlBase64ToUint8Array(value) {
  const normalized = normalizeVapidPublicKey(value);
  const padding = "=".repeat((4 - (normalized.length % 4)) % 4);
  const base64 = (normalized + padding)
    .replace(/-/g, "+")
    .replace(/_/g, "/");

  let raw;

  try {
    raw = window.atob(base64);
  } catch {
    throw new Error(
      "The push notification public key could not be decoded. Check the VAPID_PUBLIC_KEY secret in Supabase.",
    );
  }

  const bytes = Uint8Array.from(
    [...raw].map((character) => character.charCodeAt(0)),
  );

  if (bytes.length !== 65 || bytes[0] !== 4) {
    throw new Error(
      "The push notification public key is not a valid VAPID public key.",
    );
  }

  return bytes;
}

export function supportsPushNotifications() {
  return (
    "serviceWorker" in navigator &&
    "PushManager" in window &&
    "Notification" in window
  );
}

export async function getPushPublicKey() {
  const { data, error } = await supabase.functions.invoke(
    "get-push-public-key",
    {
      method: "GET",
    },
  );

  if (error) {
    throw new Error(error.message);
  }

  if (!data?.publicKey) {
    throw new Error("Push notifications are not configured yet.");
  }

  return normalizeVapidPublicKey(data.publicKey);
}

export async function getCurrentPushSubscription() {
  if (!supportsPushNotifications()) {
    return null;
  }

  const registration = await navigator.serviceWorker.ready;
  return registration.pushManager.getSubscription();
}

export async function subscribeToPushNotifications() {
  if (!supportsPushNotifications()) {
    throw new Error("Push notifications are not supported on this device.");
  }

  const permission = await Notification.requestPermission();

  if (permission !== "granted") {
    throw new Error("Notification permission was not granted.");
  }

  const registration = await navigator.serviceWorker.ready;
  const existingSubscription = await registration.pushManager.getSubscription();
  const publicKey = await getPushPublicKey();
  const expectedKey = urlBase64ToUint8Array(publicKey);

  let subscription = existingSubscription;

  if (subscription) {
    const currentKey = subscription.options?.applicationServerKey;
    const currentBytes = currentKey ? new Uint8Array(currentKey) : null;
    const keysMatch =
      currentBytes &&
      currentBytes.length === expectedKey.length &&
      currentBytes.every((byte, index) => byte === expectedKey[index]);

    if (!keysMatch) {
      await subscription.unsubscribe();
      subscription = null;
    }
  }

  if (!subscription) {
    subscription = await registration.pushManager.subscribe({
      userVisibleOnly: true,
      applicationServerKey: expectedKey,
    });
  }

  const subscriptionJson = subscription.toJSON();

  const {
    data: { session },
  } = await supabase.auth.getSession();

  const { error } = await supabase.rpc("upsert_push_subscription", {
    subscription_endpoint: subscription.endpoint,
    subscription_p256dh: subscriptionJson.keys?.p256dh,
    subscription_auth: subscriptionJson.keys?.auth,
    subscription_user_id: session?.user?.id || null,
    subscription_user_agent: navigator.userAgent,
  });

  if (error) {
    await subscription.unsubscribe().catch(() => undefined);
    throw new Error(error.message);
  }

  return subscription;
}

export async function unsubscribeFromPushNotifications() {
  const subscription = await getCurrentPushSubscription();

  if (!subscription) {
    return;
  }

  const endpoint = subscription.endpoint;
  await subscription.unsubscribe();

  const { error } = await supabase.rpc("remove_push_subscription", {
    subscription_endpoint: endpoint,
  });

  if (error) {
    throw new Error(error.message);
  }
}
