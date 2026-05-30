import { NextResponse } from "next/server";
import nodemailer from "nodemailer";
import { rateLimit } from "@/lib/rateLimiter";

export async function POST(request) {
    try {
        // Rate limit: 3 requests per minute per IP
        const ip = request.headers.get("x-forwarded-for") || "127.0.0.1";
        const { isLimited } = await rateLimit(ip, 3, 60000);
        if (isLimited) {
            return NextResponse.json(
                { success: false, message: "Too many contact form submissions. Please try again in a minute." },
                { status: 429 }
            );
        }

        const { name, email, subject, message } = await request.json();

        if (!name || !email || !subject || !message) {
            return NextResponse.json(
                { success: false, message: "All fields are required." },
                { status: 400 }
            );
        }

        // Check if environment variables are available
        if (!process.env.BREVO_SMTP_USER || !process.env.BREVO_SMTP_PASS) {
            return NextResponse.json(
                { 
                    success: false, 
                    message: `Missing Brevo SMTP environment variables. USER: ${process.env.BREVO_SMTP_USER ? 'Present' : 'Missing'}, PASS: ${process.env.BREVO_SMTP_PASS ? 'Present' : 'Missing'}` 
                },
                { status: 500 }
            );
        }

        // Create Nodemailer transporter using Brevo SMTP
        const transporter = nodemailer.createTransport({
            host: process.env.BREVO_SMTP_HOST || "smtp-relay.brevo.com",
            port: parseInt(process.env.BREVO_SMTP_PORT || "587"),
            secure: false,
            auth: {
                user: process.env.BREVO_SMTP_USER,
                pass: process.env.BREVO_SMTP_PASS,
            },
        });

        // Email to store owner (notification of new contact)
        await transporter.sendMail({
            from: `"AD KPOP MERCH" <${process.env.BREVO_SENDER_EMAIL || "noreply@adkpopmerch.com"}>`,
            to: process.env.CONTACT_RECEIVER_EMAIL || "adkpopmerch@gmail.com",
            subject: `[Contact Form] ${subject}`,
            html: `
                <div style="font-family: 'Segoe UI', Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                    <div style="background: linear-gradient(135deg, #f97316, #ea580c); padding: 24px; border-radius: 12px 12px 0 0;">
                        <h2 style="color: white; margin: 0; font-size: 20px;">New Contact Message</h2>
                        <p style="color: rgba(255,255,255,0.85); margin: 4px 0 0; font-size: 14px;">AD KPOP MERCH Contact Form</p>
                    </div>
                    <div style="background: #ffffff; padding: 24px; border: 1px solid #e5e7eb; border-top: none; border-radius: 0 0 12px 12px;">
                        <table style="width: 100%; border-collapse: collapse;">
                            <tr>
                                <td style="padding: 8px 0; color: #6b7280; font-size: 14px; width: 80px;"><strong>Name:</strong></td>
                                <td style="padding: 8px 0; color: #1f2937; font-size: 14px;">${name}</td>
                            </tr>
                            <tr>
                                <td style="padding: 8px 0; color: #6b7280; font-size: 14px;"><strong>Email:</strong></td>
                                <td style="padding: 8px 0; color: #1f2937; font-size: 14px;"><a href="mailto:${email}" style="color: #f97316;">${email}</a></td>
                            </tr>
                            <tr>
                                <td style="padding: 8px 0; color: #6b7280; font-size: 14px;"><strong>Subject:</strong></td>
                                <td style="padding: 8px 0; color: #1f2937; font-size: 14px;">${subject}</td>
                            </tr>
                        </table>
                        <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 16px 0;" />
                        <p style="color: #6b7280; font-size: 13px; margin-bottom: 8px;"><strong>Message:</strong></p>
                        <div style="background: #f9fafb; border-radius: 8px; padding: 16px; color: #374151; font-size: 14px; line-height: 1.6;">
                            ${message.replace(/\n/g, "<br>")}
                        </div>
                    </div>
                </div>
            `,
        });

        // Auto-reply to the sender
        await transporter.sendMail({
            from: `"AD KPOP MERCH" <${process.env.BREVO_SENDER_EMAIL || "noreply@adkpopmerch.com"}>`,
            to: email,
            subject: `Thank you for contacting AD KPOP MERCH!`,
            html: `
                <div style="font-family: 'Segoe UI', Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                    <div style="background: linear-gradient(135deg, #f97316, #ea580c); padding: 24px; border-radius: 12px 12px 0 0; text-align: center;">
                        <h2 style="color: white; margin: 0; font-size: 22px;">AD KPOP MERCH</h2>
                    </div>
                    <div style="background: #ffffff; padding: 24px; border: 1px solid #e5e7eb; border-top: none; border-radius: 0 0 12px 12px;">
                        <p style="color: #374151; font-size: 15px; line-height: 1.6;">Hi <strong>${name}</strong>,</p>
                        <p style="color: #6b7280; font-size: 14px; line-height: 1.6;">
                            Thank you for reaching out! We've received your message and will get back to you as soon as possible, usually within 24-48 hours.
                        </p>
                        <p style="color: #6b7280; font-size: 14px; line-height: 1.6;">
                            In the meantime, feel free to browse our latest products and collections!
                        </p>
                        <div style="text-align: center; margin: 24px 0;">
                            <a href="${process.env.NEXT_PUBLIC_SITE_URL || 'https://adkpopmerch.com'}/all-products" 
                               style="background: #f97316; color: white; padding: 12px 32px; border-radius: 8px; text-decoration: none; font-weight: 600; font-size: 14px; display: inline-block;">
                                Browse Products
                            </a>
                        </div>
                        <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 20px 0;" />
                        <p style="color: #9ca3af; font-size: 12px; text-align: center;">
                            AD KPOP MERCH — Your one-stop shop for K-pop merchandise 💛
                        </p>
                    </div>
                </div>
            `,
        });

        return NextResponse.json({ success: true, message: "Message sent successfully!" });

    } catch (error) {
        console.error("Contact form error:", error);
        return NextResponse.json(
            { success: false, message: `Failed to send message: ${error.message}` },
            { status: 500 }
        );
    }
}
