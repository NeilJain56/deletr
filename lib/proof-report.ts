import { supabase, STORAGE_BUCKET } from "@/lib/supabase";
import { resend, FROM_EMAIL } from "@/lib/resend";
import { redis } from "@/lib/redis";
import type { BrokerRemovalResult } from "@/types/broker";
import type { ExposureReport } from "@/types/scan";

function generateReportHTML(
  jobId: string,
  brokers: BrokerRemovalResult[],
  report: ExposureReport
): string {
  const rows = brokers
    .map(
      (b) => `
    <tr>
      <td style="padding: 10px 16px; border-bottom: 1px solid #1E1E1E; font-size: 14px; color: #EDEDED;">${b.name}</td>
      <td style="padding: 10px 16px; border-bottom: 1px solid #1E1E1E; font-size: 14px; color: #878787;">${b.timestamp}</td>
      <td style="padding: 10px 16px; border-bottom: 1px solid #1E1E1E; font-size: 14px; color: #34D399;">Removed</td>
    </tr>`
    )
    .join("");

  const scoreAfter = Math.min(report.privacyScore + brokers.length * 5, 95);

  return `<!DOCTYPE html>
<html>
<head><meta charset="utf-8"><title>Deletr — Deletion Certificate</title></head>
<body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; max-width: 600px; margin: 0 auto; padding: 40px 32px; background-color: #0C0C0C; color: #EDEDED;">
  <div style="text-align: center; margin-bottom: 40px;">
    <p style="font-size: 18px; font-weight: 500; margin: 0 0 4px 0; color: #EDEDED;">deletr</p>
    <p style="font-size: 14px; color: #878787; margin: 0;">Deletion Certificate</p>
  </div>

  <div style="background: #161616; border: 1px solid #1E1E1E; border-radius: 12px; padding: 20px; margin-bottom: 32px;">
    <p style="font-size: 13px; margin: 4px 0; color: #878787;">Date: <span style="color: #EDEDED;">${new Date().toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })}</span></p>
    <p style="font-size: 13px; margin: 4px 0; color: #878787;">Reference: <span style="color: #EDEDED;">${jobId}</span></p>
    <p style="font-size: 13px; margin: 4px 0; color: #878787;">Privacy Score: <span style="color: #34D399;">${report.privacyScore} → ${scoreAfter}</span></p>
  </div>

  <table style="width: 100%; border-collapse: collapse; margin-bottom: 32px;">
    <thead>
      <tr>
        <th style="padding: 10px 16px; text-align: left; font-size: 12px; font-weight: 500; color: #878787; border-bottom: 1px solid #1E1E1E;">Broker</th>
        <th style="padding: 10px 16px; text-align: left; font-size: 12px; font-weight: 500; color: #878787; border-bottom: 1px solid #1E1E1E;">Timestamp</th>
        <th style="padding: 10px 16px; text-align: left; font-size: 12px; font-weight: 500; color: #878787; border-bottom: 1px solid #1E1E1E;">Status</th>
      </tr>
    </thead>
    <tbody>${rows}</tbody>
  </table>

  <div style="border-top: 1px solid #1E1E1E; padding-top: 20px; font-size: 12px; color: #555;">
    <p style="margin: 0 0 8px 0;">This report documents automated opt-out requests submitted on behalf of the data subject under applicable US privacy regulations including CCPA.</p>
    <p style="margin: 0;">&copy; 2026 Deletr</p>
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
    subject: "Your data has been deleted — Deletr",
    html: `
      <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; max-width: 420px; margin: 0 auto; padding: 40px 32px; background-color: #0C0C0C; color: #EDEDED;">
        <p style="font-size: 16px; font-weight: 500; margin: 0 0 24px 0;">deletr</p>
        <p style="font-size: 15px; font-weight: 500; margin: 0 0 12px 0;">Your data has been deleted.</p>
        <p style="font-size: 14px; color: #878787; line-height: 1.6; margin: 0 0 24px 0;">
          We submitted opt-out requests to ${brokers.length} data broker${brokers.length !== 1 ? "s" : ""} on your behalf. Your full deletion certificate is below.
        </p>
        ${reportUrl ? `<a href="${reportUrl}" style="display: inline-block; padding: 12px 24px; background: #34D399; color: #0C0C0C; text-decoration: none; border-radius: 10px; font-size: 14px; font-weight: 500;">View deletion report</a>` : ""}
        <hr style="border: none; border-top: 1px solid #1E1E1E; margin: 32px 0 16px 0;" />
        <p style="font-size: 11px; color: #555; margin: 0;">
          &copy; 2026 Deletr &middot; This link expires in 1 year.
        </p>
      </div>
    `,
  });
}
