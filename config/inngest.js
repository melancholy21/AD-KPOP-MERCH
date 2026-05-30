import { Inngest } from "inngest";
import connectDB from "./db";
import User from "@/models/User";
import Order from "@/models/Order";
import nodemailer from "nodemailer";

// Create a client to send and receive events
export const inngest = new Inngest({ id: "ad-kpop-merch-next" });


//Inngest function to save user data to a database
export const syncUserCreation = inngest.createFunction(
    {
        id: 'sync-user-from-clerk',
        triggers: [{ event: 'clerk/user.created' }]
    },
    async ({event}) => {
        const { id, first_name, last_name, email_addresses, image_url } = event.data
        const userData = {
            _id:id,
            email: email_addresses[0].email_address,
            name: first_name + ' ' + last_name,
            imageUrl:image_url
        }
        await connectDB()
        await User.create(userData)
    }
)

//Inngest function to update user data in the database
export const syncUserUpdation = inngest.createFunction(
    {
        id: 'update-user-from-clerk',
        triggers: [{ event: 'clerk/user.updated' }]
    },
    async ({event}) => {
        const { id, first_name, last_name, email_addresses, image_url } = event.data
        const userData = {
            _id:id,
            email: email_addresses[0].email_address,
            name: first_name + ' ' + last_name,
            imageUrl:image_url
        }
        await connectDB()
        await User.findByIdAndUpdate(id, userData)
    }
)

//Inngest function to delete user data from the database
export const syncUserDeletion = inngest.createFunction(
    {
        id: 'delete-user-with-clerk',
        triggers: [{ event: 'clerk/user.deleted' }]
    },
    async({event}) => {
        const { id } = event.data

        await connectDB()
        await User.findByIdAndDelete(id)
    }
)

// Inngest function to send order confirmation transactional email
export const syncOrderReceiptEmail = inngest.createFunction(
    {
        id: 'send-order-receipt-email',
        triggers: [{ event: 'order.created' }]
    },
    async ({ event }) => {
        const { orderId, userEmail, userName, amount, items } = event.data;

        await connectDB();
        
        // Fetch full order details including populated product names
        const order = await Order.findById(orderId).populate('items.product');
        if (!order) {
            console.error(`Order ${orderId} not found in database.`);
            return;
        }

        // Initialize SMTP transporter
        const transporter = nodemailer.createTransport({
            host: process.env.BREVO_SMTP_HOST || "smtp-relay.brevo.com",
            port: parseInt(process.env.BREVO_SMTP_PORT || "587"),
            secure: false,
            auth: {
                user: process.env.BREVO_SMTP_USER,
                pass: process.env.BREVO_SMTP_PASS,
            },
        });

        // Format items table for HTML email
        let itemsHtml = "";
        for (const item of order.items) {
            const prod = item.product;
            const price = prod?.offerPrice || 0;
            const name = prod?.name || "Product";
            itemsHtml += `
                <tr>
                    <td style="padding: 12px; border-bottom: 1px solid #e5e7eb; font-size: 14px; color: #374151;">${name}</td>
                    <td style="padding: 12px; border-bottom: 1px solid #e5e7eb; font-size: 14px; color: #374151; text-align: center;">${item.quantity}</td>
                    <td style="padding: 12px; border-bottom: 1px solid #e5e7eb; font-size: 14px; color: #374151; text-align: right;">₱${(price * item.quantity).toFixed(2)}</td>
                </tr>
            `;
        }

        // Send confirmation email
        await transporter.sendMail({
            from: `"AD KPOP MERCH" <${process.env.BREVO_SENDER_EMAIL || "noreply@adkpopmerch.com"}>`,
            to: userEmail,
            subject: `Order Confirmed! Your receipt for order #${orderId.toString().slice(-6).toUpperCase()}`,
            html: `
                <div style="font-family: 'Segoe UI', Arial, sans-serif; max-width: 600px; margin: 0 auto; background-color: #f9fafb; padding: 20px;">
                    <div style="background: linear-gradient(135deg, #f97316, #ea580c); padding: 32px; border-radius: 12px 12px 0 0; text-align: center;">
                        <h1 style="color: white; margin: 0; font-size: 26px; font-weight: 700; letter-spacing: -0.5px;">Order Confirmed!</h1>
                        <p style="color: rgba(255,255,255,0.9); margin: 8px 0 0; font-size: 15px;">Thank you for shopping with AD KPOP MERCH 💛</p>
                    </div>
                    
                    <div style="background: #ffffff; padding: 32px; border: 1px solid #e5e7eb; border-top: none; border-radius: 0 0 12px 12px;">
                        <p style="font-size: 16px; color: #1f2937; margin-top: 0;">Hi <strong>${userName || 'Valued Customer'}</strong>,</p>
                        <p style="font-size: 14px; color: #4b5563; line-height: 1.6;">
                            Your order has been successfully placed. We're currently processing your items and will notify you as soon as they ship. Below are your transaction details:
                        </p>
                        
                        <div style="background: #fff7ed; border: 1px solid #ffedd5; border-radius: 8px; padding: 16px; margin: 24px 0;">
                            <table style="width: 100%; border-collapse: collapse; font-size: 14px;">
                                <tr>
                                    <td style="color: #ea580c; font-weight: 600; padding: 4px 0;">Order Reference:</td>
                                    <td style="color: #374151; text-align: right; font-family: monospace; font-weight: bold;">#${orderId.toString().toUpperCase()}</td>
                                </tr>
                                <tr>
                                    <td style="color: #ea580c; font-weight: 600; padding: 4px 0;">Order Date:</td>
                                    <td style="color: #374151; text-align: right;">${new Date(order.date).toLocaleDateString()}</td>
                                </tr>
                                <tr>
                                    <td style="color: #ea580c; font-weight: 600; padding: 4px 0;">Payment Status:</td>
                                    <td style="color: #16a34a; font-weight: 600; text-align: right;">Pending (Mock Checkout)</td>
                                </tr>
                            </table>
                        </div>

                        <h3 style="color: #1f2937; border-bottom: 2px solid #f3f4f6; padding-bottom: 8px; margin-top: 32px; font-size: 16px;">Items Summary</h3>
                        <table style="width: 100%; border-collapse: collapse; margin-top: 12px;">
                            <thead>
                                <th style="padding: 12px; background-color: #f9fafb; font-size: 12px; font-weight: 600; text-align: left; color: #4b5563; border-bottom: 1px solid #e5e7eb;">Product</th>
                                <th style="padding: 12px; background-color: #f9fafb; font-size: 12px; font-weight: 600; text-align: center; color: #4b5563; border-bottom: 1px solid #e5e7eb;">Qty</th>
                                <th style="padding: 12px; background-color: #f9fafb; font-size: 12px; font-weight: 600; text-align: right; color: #4b5563; border-bottom: 1px solid #e5e7eb;">Total</th>
                            </thead>
                            <tbody>
                                ${itemsHtml}
                                <tr>
                                    <td colspan="2" style="padding: 16px 12px 12px; font-weight: 700; font-size: 15px; color: #1f2937; text-align: right;">Total Amount:</td>
                                    <td style="padding: 16px 12px 12px; font-weight: 700; font-size: 18px; color: #ea580c; text-align: right;">₱${amount.toFixed(2)}</td>
                                </tr>
                            </tbody>
                        </table>

                        <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 32px 0;" />
                        <p style="color: #9ca3af; font-size: 12px; text-align: center; margin-bottom: 0;">
                            This is an automated transaction receipt for your project store AD KPOP MERCH 💛
                        </p>
                    </div>
                </div>
            `,
        });
    }
);
