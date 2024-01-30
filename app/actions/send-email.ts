"use server";

import nodemailer from "nodemailer";
import { z } from "zod";

const transport = nodemailer.createTransport({
  host: process.env.NEXT_TRANSPORT_HOST,
  port: Number(process.env.NEXT_TRANSPORT_PORT) || 578,
  auth: {
    user: process.env.NEXT_TRANSPORT_USERNAME,
    pass: process.env.NEXT_TRANSPORT_PASSWORD,
  },
});

const schema = z.object({
  name: z
    .string()
    .max(100, { message: "Name should be less than 100 characters" })
    .min(1, { message: "Name is required" }),
  email: z.string().email({
    message: "Invalid email address",
  }),
  message: z
    .string()
    .max(500, { message: "Message should be less than 500 characters" })
    .min(1, { message: "Message is required" }),
});

export async function sendEmail(initialState: any, formData: FormData) {
  const name = formData.get("name");
  const email = formData.get("email");
  const message = formData.get("message");

  const validatedFields = schema.safeParse({
    name,
    email,
    message,
  });

  if (!validatedFields.success) {
    return {
      sent: false,
      errors: validatedFields.error.flatten().fieldErrors,
    };
  }

  try {
    await transport.sendMail({
      to: "contact-receiving-email@example.com",
      from: "service-provider-email@example.com",
      subject: "New contact request!",
      html: `<!DOCTYPE html>
        <html lang="en">
        <body>
            <p>Name: ${name}</p>
            <p>Email: ${email}</p>
            <p>Message: ${message}</p>
        </body>
        </html>`,
    });
    return { sent: true };
  } catch (error) {
    return { sent: false };
  }
}
