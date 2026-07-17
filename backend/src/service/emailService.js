import nodemailer from "nodemailer";

let transporter = null;

const getTransporter = () => {
  if (transporter) {
    return transporter;
  }

  if (!process.env.email_user || !process.env.email_pass) {
    return null;
  }

  transporter = nodemailer.createTransport({
    host: process.env.email_host || "smtp.gmail.com",
    port: Number(process.env.email_port) || 587,
    secure: Number(process.env.email_port) === 465,
    auth: {
      user: process.env.email_user,
      pass: process.env.email_pass,
    },
  });

  return transporter;
};

const buildReceiptHtml = ({
  bookingCode,
  riderName,
  partnerName,
  discountPercentage,
  pointsUsed,
  address
}) => {
  return `
    <div style="font-family: Arial, sans-serif; max-width: 560px; margin: auto; border: 1px solid #e5e7eb; border-radius: 8px; overflow: hidden;">
      <div style="background: #16a34a; color: #ffffff; padding: 20px 24px;">
        <h2 style="margin: 0;">Sahaaya — Redemption Receipt</h2>
        <p style="margin: 4px 0 0;">You redeemed points for a restaurant discount.</p>
      </div>
      <div style="padding: 24px;">
        <table style="width: 100%; border-collapse: collapse;">
          <tr>
            <td style="padding: 8px 0; color: #6b7280;">Booking Code</td>
            <td style="padding: 8px 0; font-weight: bold; font-size: 18px; color: #16a34a; text-align: right;">${bookingCode}</td>
          </tr>
          <tr>
            <td style="padding: 8px 0; color: #6b7280; border-top: 1px solid #f3f4f6;">Restaurant</td>
            <td style="padding: 8px 0; text-align: right; border-top: 1px solid #f3f4f6;">${partnerName}</td>
          </tr>
          <tr>
            <td style="padding: 8px 0; color: #6b7280; border-top: 1px solid #f3f4f6;">Restaurant Address</td>
            <td style="padding: 8px 0; text-align: right; border-top: 1px solid #f3f4f6;">${address}</td>
          </tr>
          <tr>
            <td style="padding: 8px 0; color: #6b7280; border-top: 1px solid #f3f4f6;">Rider</td>
            <td style="padding: 8px 0; text-align: right; border-top: 1px solid #f3f4f6;">${riderName}</td>
          </tr>
          <tr>
            <td style="padding: 8px 0; color: #6b7280; border-top: 1px solid #f3f4f6;">Discount</td>
            <td style="padding: 8px 0; text-align: right; border-top: 1px solid #f3f4f6;">${discountPercentage}% off your total bill</td>
          </tr>
          <tr>
            <td style="padding: 8px 0; color: #6b7280; border-top: 1px solid #f3f4f6;">Points Used</td>
            <td style="padding: 8px 0; text-align: right; border-top: 1px solid #f3f4f6;">${pointsUsed}</td>
          </tr>
        </table>
        <div style="margin-top: 20px; padding: 12px 16px; background: #f0fdf4; border-radius: 6px; color: #166534; font-size: 14px;">
          Show this booking code along with your registered phone number at the restaurant to claim your discount.
        </div>
      </div>
      <div style="padding: 16px 24px; background: #f9fafb; color: #9ca3af; font-size: 12px; text-align: center;">
        Sahaaya — connecting donors, NGOs, and delivery partners.
      </div>
    </div>
  `;
};

const sendReceipt = async ({ redemption, rider, partner }) => {
  const transport = getTransporter();

  if (!transport) {
    console.log(
      `[email] SMTP not configured — skipping receipt for booking ${redemption.bookingCode}`
    );
    return { sent: false, reason: "smtp-not-configured" };
  }

  const recipients = [rider?.email, partner?.email].filter(Boolean);

  if (recipients.length === 0) {
    return { sent: false, reason: "no-recipients" };
  }

  try {
    await transport.sendMail({
      from: process.env.email_from || process.env.email_user,
      to: recipients.join(","),
      subject: `Sahaaya Redemption Receipt — ${redemption.bookingCode}`,
      html: buildReceiptHtml({
        bookingCode: redemption.bookingCode,
        riderName: rider?.name || "Rider",
        partnerName: partner?.name || "Restaurant Partner",
        discountPercentage: redemption.discountPercentage,
        pointsUsed: redemption.pointsUsed,
        address: partner?.address,
      }),
    });
    return { sent: true };
  } catch (error) {
    console.log(
      `[email] Failed to send receipt for booking ${redemption.bookingCode}:`,
      error
    );
    return { sent: false, reason: "send-failed" };
  }
};

export { sendReceipt };
