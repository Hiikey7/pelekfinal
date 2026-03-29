import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const SMTP_HOST = Deno.env.get("SMTP_HOST") || "smtp.gmail.com";
const SMTP_PORT = Deno.env.get("SMTP_PORT") || "587";
const SMTP_USER = Deno.env.get("SMTP_USER") || "";
const SMTP_PASS = Deno.env.get("SMTP_PASS") || "";
const SMTP_FROM =
  Deno.env.get("SMTP_FROM") || "Pelek Properties <info@pelekproperties.co.ke>";
const SMTP_TO = Deno.env.get("SMTP_TO") || "info@pelekproperties.co.ke";

function buildEmailHtml(data: {
  name: string;
  email: string;
  phone: string;
  subject: string;
  message: string;
}): string {
  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>New Contact Form Submission</title>
</head>
<body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
  <div style="background: linear-gradient(135deg, #003329 0%, #006644 100%); padding: 30px; border-radius: 10px 10px 0 0;">
    <h1 style="color: white; margin: 0; font-size: 24px;">New Contact Form Submission</h1>
    <p style="color: #a0e0b0; margin: 5px 0 0 0;">Pelek Properties Website</p>
  </div>
  
  <div style="background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px;">
    <table style="width: 100%; border-collapse: collapse;">
      <tr>
        <td style="padding: 12px 0; border-bottom: 1px solid #e0e0e0;">
          <strong style="color: #003329;">Name:</strong>
        </td>
        <td style="padding: 12px 0; border-bottom: 1px solid #e0e0e0;">
          ${data.name}
        </td>
      </tr>
      <tr>
        <td style="padding: 12px 0; border-bottom: 1px solid #e0e0e0;">
          <strong style="color: #003329;">Email:</strong>
        </td>
        <td style="padding: 12px 0; border-bottom: 1px solid #e0e0e0;">
          <a href="mailto:${data.email}" style="color: #006644;">${data.email}</a>
        </td>
      </tr>
      <tr>
        <td style="padding: 12px 0; border-bottom: 1px solid #e0e0e0;">
          <strong style="color: #003329;">Phone:</strong>
        </td>
        <td style="padding: 12px 0; border-bottom: 1px solid #e0e0e0;">
          ${data.phone || "Not provided"}
        </td>
      </tr>
      <tr>
        <td style="padding: 12px 0; border-bottom: 1px solid #e0e0e0;">
          <strong style="color: #003329;">Subject:</strong>
        </td>
        <td style="padding: 12px 0; border-bottom: 1px solid #e0e0e0;">
          ${data.subject}
        </td>
      </tr>
      <tr>
        <td style="padding: 12px 0;" colspan="2">
          <strong style="color: #003329;">Message:</strong>
          <p style="margin: 8px 0 0 0; padding: 15px; background: white; border-radius: 5px; border-left: 4px solid #003329;">
            ${data.message.replace(/\n/g, "<br>")}
          </p>
        </td>
      </tr>
    </table>
    
    <div style="margin-top: 20px; padding-top: 20px; border-top: 1px solid #e0e0e0; text-align: center; color: #888; font-size: 12px;">
      <p>This email was sent from the contact form on pelekproperties.com</p>
    </div>
  </div>
</body>
</html>
`;
}

function buildEmailText(data: {
  name: string;
  email: string;
  phone: string;
  subject: string;
  message: string;
}): string {
  return `
New Contact Form Submission
Pelek Properties Website
------------------------

Name: ${data.name}
Email: ${data.email}
Phone: ${data.phone || "Not provided"}
Subject: ${data.subject}

Message:
${data.message}

---
This email was sent from the contact form on pelekproperties.com
`;
}

async function sendEmail(data: {
  name: string;
  email: string;
  phone: string;
  subject: string;
  message: string;
}): Promise<{ success: boolean; message: string }> {
  if (!SMTP_USER || !SMTP_PASS) {
    console.error("SMTP credentials not configured");
    return { success: false, message: "Email service not configured" };
  }

  const boundary = "----=_Part_" + Math.random().toString(36).substring(2);

  const htmlBody = buildEmailHtml(data);
  const textBody = buildEmailText(data);

  const emailContent = [
    `From: ${SMTP_FROM}`,
    `To: ${SMTP_TO}`,
    `Subject: [Pelek Properties] ${data.subject}`,
    `MIME-Version: 1.0`,
    `Content-Type: multipart/alternative; boundary="${boundary}"`,
    "",
    `--${boundary}`,
    `Content-Type: text/plain; charset="UTF-8"`,
    "",
    textBody,
    "",
    `--${boundary}`,
    `Content-Type: text/html; charset="UTF-8"`,
    "",
    htmlBody,
    "",
    `--${boundary}--`,
  ].join("\r\n");

  const smtpCommand = [
    `EHLO ${SMTP_HOST}`,
    `AUTH LOGIN`,
    Buffer.from(SMTP_USER).toString("base64"),
    Buffer.from(SMTP_PASS).toString("base64"),
    `MAIL FROM:<${SMTP_USER}>`,
    `RCPT TO:<${SMTP_TO}>`,
    `DATA`,
    emailContent,
    `QUIT`,
  ].join("\r\n");

  try {
    const conn = await Deno.connectTls(SMTP_HOST, {
      port: parseInt(SMTP_PORT),
    });

    const encoder = new TextEncoder();
    const decoder = new TextDecoder();

    const reader = conn.readable.getReader();
    const writer = conn.writable.getWriter();

    // Read greeting
    const { value } = await reader.read();
    if (value) {
      console.log("SMTP Greeting:", decoder.decode(value));
    }

    // Send EHLO
    await writer.write(encoder.encode("EHLO " + SMTP_HOST + "\r\n"));
    await new Promise((r) => setTimeout(r, 100));

    // Read EHLO response
    try {
      const { value: ehloResponse } = await reader.read();
      if (ehloResponse) {
        console.log("EHLO Response:", decoder.decode(ehloResponse));
      }
    } catch (e) {
      console.log("EHLO read error:", e);
    }

    // Auth login
    await writer.write(encoder.encode("AUTH LOGIN\r\n"));
    await new Promise((r) => setTimeout(r, 100));

    await writer.write(
      encoder.encode(Buffer.from(SMTP_USER).toString("base64") + "\r\n"),
    );
    await new Promise((r) => setTimeout(r, 100));

    await writer.write(
      encoder.encode(Buffer.from(SMTP_PASS).toString("base64") + "\r\n"),
    );
    await new Promise((r) => setTimeout(r, 100));

    // MAIL FROM
    await writer.write(encoder.encode(`MAIL FROM:<${SMTP_USER}>\r\n`));
    await new Promise((r) => setTimeout(r, 100));

    // RCPT TO
    await writer.write(encoder.encode(`RCPT TO:<${SMTP_TO}>\r\n`));
    await new Promise((r) => setTimeout(r, 100));

    // DATA
    await writer.write(encoder.encode("DATA\r\n"));
    await new Promise((r) => setTimeout(r, 100));

    // Email content
    await writer.write(encoder.encode(emailContent + "\r\n"));
    await new Promise((r) => setTimeout(r, 100));

    // QUIT
    await writer.write(encoder.encode("QUIT\r\n"));

    await writer.close();
    await reader.cancel();

    return { success: true, message: "Email sent successfully" };
  } catch (error) {
    console.error("Email send error:", error);
    return {
      success: false,
      message: "Failed to send email: " + String(error),
    };
  }
}

serve(async (req) => {
  // Handle CORS
  if (req.method === "OPTIONS") {
    return new Response("ok", {
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "POST, OPTIONS",
        "Access-Control-Allow-Headers": "Content-Type",
      },
    });
  }

  if (req.method !== "POST") {
    return new Response(JSON.stringify({ error: "Method not allowed" }), {
      status: 405,
      headers: { "Content-Type": "application/json" },
    });
  }

  try {
    const body = await req.json();
    const { name, email, phone, subject, message } = body;

    // Validate required fields
    if (!name || !email || !subject || !message) {
      return new Response(
        JSON.stringify({ error: "All fields are required" }),
        { status: 400, headers: { "Content-Type": "application/json" } },
      );
    }

    // Send email
    const result = await sendEmail({ name, email, phone, subject, message });

    if (result.success) {
      return new Response(
        JSON.stringify({ success: true, message: "Email sent successfully" }),
        {
          status: 200,
          headers: {
            "Content-Type": "application/json",
            "Access-Control-Allow-Origin": "*",
          },
        },
      );
    } else {
      return new Response(JSON.stringify({ error: result.message }), {
        status: 500,
        headers: { "Content-Type": "application/json" },
      });
    }
  } catch (error) {
    console.error("Error:", error);
    return new Response(JSON.stringify({ error: "Internal server error" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
});
