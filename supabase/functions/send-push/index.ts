import "jsr:@supabase/functions-js/edge-runtime.d.ts";

import webpush from "npm:web-push@3.6.7";
import { createClient } from "jsr:@supabase/supabase-js@2";

const FOUNDER_EMAIL = "lilmunofficial18@gmail.com";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

Deno.serve(async (request: Request) => {
  if (request.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  if (request.method !== "POST") {
    return new Response(JSON.stringify({ error: "Method not allowed." }), {
      status: 405,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }

  try {
    const supabaseUrl = Deno.env.get("SUPABASE_URL");
    const anonKey = Deno.env.get("SUPABASE_ANON_KEY");
    const serviceRoleKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");
    const vapidPublicKey = Deno.env.get("VAPID_PUBLIC_KEY");
    const vapidPrivateKey = Deno.env.get("VAPID_PRIVATE_KEY");
    const vapidSubject = Deno.env.get("VAPID_SUBJECT") || "mailto:lilmunofficial18@gmail.com";

    if (
      !supabaseUrl ||
      !anonKey ||
      !serviceRoleKey ||
      !vapidPublicKey ||
      !vapidPrivateKey
    ) {
      throw new Error("Push notification secrets are not fully configured.");
    }

    const authorization = request.headers.get("Authorization");

    if (!authorization) {
      return new Response(JSON.stringify({ error: "Missing authorization." }), {
        status: 401,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const userClient = createClient(supabaseUrl, anonKey, {
      global: {
        headers: {
          Authorization: authorization,
        },
      },
    });

    const {
      data: { user },
      error: userError,
    } = await userClient.auth.getUser();

    if (
      userError ||
      !user ||
      user.email?.trim().toLowerCase() !== FOUNDER_EMAIL.toLowerCase()
    ) {
      return new Response(JSON.stringify({ error: "Admin access required." }), {
        status: 403,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const payload = await request.json();
    const title = String(payload?.title || "").trim();
    const body = String(payload?.body || "").trim();
    const targetUrl = String(payload?.url || "/").trim() || "/";

    if (!title || !body) {
      return new Response(
        JSON.stringify({ error: "A notification title and message are required." }),
        {
          status: 400,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        },
      );
    }

    if (title.length > 80 || body.length > 240) {
      return new Response(
        JSON.stringify({ error: "The notification exceeds the allowed length." }),
        {
          status: 400,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        },
      );
    }

    webpush.setVapidDetails(vapidSubject, vapidPublicKey, vapidPrivateKey);

    const adminClient = createClient(supabaseUrl, serviceRoleKey);

    const { data: subscriptions, error: subscriptionError } = await adminClient
      .from("push_subscriptions")
      .select("id, endpoint, p256dh, auth")
      .eq("is_active", true);

    if (subscriptionError) {
      throw subscriptionError;
    }

    const notificationPayload = JSON.stringify({
      title,
      body,
      url: targetUrl,
      icon: "/pwa-192x192.png",
      badge: "/pwa-192x192.png",
      tag: `aiwcore-${Date.now()}`,
    });

    let sent = 0;
    let failed = 0;
    const expiredIds: string[] = [];

    await Promise.allSettled(
      (subscriptions || []).map(async (subscription) => {
        try {
          await webpush.sendNotification(
            {
              endpoint: subscription.endpoint,
              keys: {
                p256dh: subscription.p256dh,
                auth: subscription.auth,
              },
            },
            notificationPayload,
          );

          sent += 1;
        } catch (error) {
          failed += 1;

          const statusCode =
            typeof error === "object" && error && "statusCode" in error
              ? Number(error.statusCode)
              : 0;

          if (statusCode === 404 || statusCode === 410) {
            expiredIds.push(subscription.id);
          }
        }
      }),
    );

    if (expiredIds.length) {
      await adminClient
        .from("push_subscriptions")
        .update({ is_active: false, updated_at: new Date().toISOString() })
        .in("id", expiredIds);
    }

    const { error: logError } = await adminClient.from("push_notifications").insert({
      title,
      body,
      target_url: targetUrl,
      sent_count: sent,
      failed_count: failed,
      created_by: user.id,
    });

    if (logError) {
      console.error("Unable to save push notification log:", logError.message);
    }

    return new Response(
      JSON.stringify({
        success: true,
        sent,
        failed,
        total: subscriptions?.length || 0,
      }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      },
    );
  } catch (error) {
    console.error("send-push error:", error);

    return new Response(
      JSON.stringify({
        error:
          error instanceof Error
            ? error.message
            : "AIWCORE could not send the push notification.",
      }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      },
    );
  }
});
