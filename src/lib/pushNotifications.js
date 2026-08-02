import { supabase } from "./supabase.js";

function urlBase64ToUint8Array(value) {
  const padding = "=".repeat((4 - (value.length % 4)) % 4);
  const base64 = (value + padding).replace(/-/g, "+").replace(/_/g, "/");
  const raw = window.atob(base64);

  return Uint8Array.from([...raw].map((character) => character.charCodeAt(0)));
}

export function supportsPushNotifications() {
  return (
    "serviceWorker" in navigator &&
    "PushManager" in window &&
    "Notification" in window
  );
}

export async function getPushPublicKey() {
  const { data, error } = await supabase.rpc("get_push_public_key");

  if (error) {
    throw new Error(error.message);
  }

  if (!data) {
    throw new Error("Push notifications are not configured yet.");
  }

  return data;
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

  const subscription =
    existingSubscription ||
    (await registration.pushManager.subscribe({
      userVisibleOnly: true,
      applicationServerKey: urlBase64ToUint8Array(publicKey),
    }));

  const subscriptionJson = subscription.toJSON();

  const { data: { session } } = await supabase.auth.getSession();

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
