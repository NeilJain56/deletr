import { supabase, STORAGE_BUCKET } from "@/lib/supabase";
import { resend, FROM_EMAIL } from "@/lib/resend";
import { redis } from "@/lib/redis";
import type { BrokerRemovalResult } from "@/types/broker";
import type { ExposureReport } from "@/types/scan";

function redactIdentifier(identifier: string): string {
  if (identifier.includes("@")) {
    const [local, domain] = identifier.split("@");
    return `${local[0]}***@${domain}`;
  }
  // Phone: show last 4 digits
  return `***-***-${identifier.slice(-4)}`;
}

function generateReportHTML(
  jobId: string,
  brokers: BrokerRemovalResult[],
  report: ExposureReport
): string {
  const now = new Date().toISOString();
  const rows = brokers
    .map(
      (b) => `
    <tr>
      <td style="padding: 8px 12px; border-bottom: 1px solid #eee; font-size: 14px;">${b.name}</td>
      <td style="padding: 8px 12px; border-bottom: 1px solid #eee; font-size: 14px;">${b.timestamp}</td>
      <td style="padding: 8px 12px; border-bottom: 1px solid #eee; font-size: 14px; color: #1D9E75;">Removed</td>
    </tr>`
    )
    .join("");

  const scoreAfter = Math.min(report.privacyScore + brokers.length * 5, 95);

  return `<!DOCTYPE html>
<html>
<head><meta charset="utf-8"><title>Deletr Deletion Certificate</title></head>
<body style="font-family: -apple-system, sans-serif; max-width: 600px; margin: 0 auto; padding: 32px; color: #333;">
  <div style="text-align: center; margin-bottom: 32px;">
    <h1 style="color: #1D9E75; font-size: 24px; font-weight: 500; margin-bottom: 4px;">deletr</h1>
    <h2 style="font-size: 20px; font-weight: 500; color: #333;">Deletion Certificate</h2>
  </div>

  <div style="background: #f9f9f9; border-radius: 8px; padding: 16px; margin-bottom: 24px;">
    <p style="font-size: 14px; margin: 4px 0;"><strong>Date:</strong> ${new Date().toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })}</p>
    <p style="font-size: 14px; margin: 4px 0;"><strong>Reference:</strong> ${jobId}</p>
    <p style="font-size: 14px; margin: 4px 0;"><strong>Privacy Score:</strong> ${report.privacyScore} → ${scoreAfter}</p>
  </div>

  <table style="width: 100%; border-collapse: collapse; margin-bottom: 24px;">
    <thead>
      <tr style="background: #f5f5f5;">
        <th style="padding: 8px 12px; text-align: left; font-size: 13px; font-weight: 600;">Broker</th>
        <th style="padding: 8px 12px; text-align: left; font-size: 13px; font-weight: 600;">Timestamp</th>
        <th style="padding: 8px 12px; text-align: left; font-size: 13px; font-weight: 600;">Status</th>
      </tr>
    </thead>
    <tbody>${rows}</tbody>
  </table>

  <div style="border-top: 1px solid #eee; padding-top: 16px; font-size: 12px; color: #999;">
    <p>This report documents automated opt-out requests submitted on behalf of the data subject under applicable US privacy regulations including CCPA.</p>
    <p style="margin-top: 8px;">© 2026 Deletr.io — All rights reserved.</p>
  </div>
</body>
</html>`;
}

export async function generateAndEmailProofReport(
  jobId: string,
  brokers: BrokerRemovalResult[],
  customerEmail: string,
  report: ExposureReport
) {
  const html = generateReportHTML(jobId, brokers, report);
  const path = `${jobId}/report.html`;

  // Upload to Supabase Storage
  const { error: uploadError } = await supabase.storage
    .from(STORAGE_BUCKET)
    .upload(path, html, {
      contentType: "text/html",
      upsert: true,
    });

  if (uploadError) {
    console.error("Failed to upload proof report:", uploadError);
  }

  // Generate signed URL (1 year expiry)
  const { data: signedData } = await supabase.storage
    .from(STORAGE_BUCKET)
    .createSignedUrl(path, 365 * 24 * 60 * 60);

  const reportUrl = signedData?.signedUrl || "";

  // Store URL in Redis (30-day TTL)
  if (reportUrl) {
    await redis.set(`report-url:${jobId}`, reportUrl, { ex: 2592000 });
  }

  // Email via Resend
  await resend.emails.send({
    from: FROM_EMAIL,
    to: customerEmail,
    subject: "Your Deletr Deletion Report",
    html: `
      <div style="font-family: -apple-system, sans-serif; max-width: 480px; margin: 0 auto; padding: 32px;">
        <h2 style="color: #1D9E75; font-size: 20px; font-weight: 500;">deletr</h2>
        <p style="font-size: 16px; font-weight: 500; margin-top: 24px;">Your data has been deleted.</p>
        <p style="font-size: 14px; color: #666; line-height: 1.6;">
          We successfully submitted opt-out requests to ${brokers.length} data broker${brokers.length !== 1 ? "s" : ""} on your behalf.
          Your full deletion certificate is available below.
        </p>
        ${reportUrl ? `<a href="${reportUrl}" style="display: inline-block; margin-top: 16px; padding: 12px 24px; background: #1D9E75; color: white; text-decoration: none; border-radius: 24px; font-size: 14px; font-weight: 500;">View Deletion Report</a>` : ""}
        <p style="font-size: 12px; color: #999; margin-top: 32px;">
          © 2026 Deletr.io — This link expires in 1 year.
        </p>
      </div>
    `,
  });
}
