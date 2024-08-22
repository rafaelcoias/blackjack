import { NextRequest, NextResponse } from "next/server";
import nodemailer from "nodemailer";
import path from "path";
import { promises as fs } from "fs";

export const POST = async (req: NextRequest) => {
  /* eslint-disable @typescript-eslint/no-unsafe-argument */
  /* eslint-disable @typescript-eslint/no-unsafe-assignment */
  const { email, contact, message } = await req.json();
  if (!email || !contact || !message) {
    return NextResponse.json({
      message: "Email, contact and message are required",
      status: 400,
    });
  }

  try {
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_ADDRESS,
        pass: process.env.EMAIL_PASSWORD,
      },
    });

    // Read the HTML template file
    const filePath = path.join(process.cwd(), "./public/email.html");
    let htmlContent = await fs.readFile(filePath, "utf-8");

    htmlContent = htmlContent.replace("{$email}", email);
    htmlContent = htmlContent.replace("{$contact}", contact);
    htmlContent = htmlContent.replace("{$message}", message);

    const mailOptions = {
      from: process.env.EMAIL_ADDRESS,
      to: "info@tl-tools.pt",
      subject: "Mensagem do Website",
      html: htmlContent,
    };

    await transporter.sendMail(mailOptions);
    return NextResponse.json({
      message: "Email sent successfully",
      status: 200,
    });
  } catch (e) {
    console.error(e);
    return NextResponse.json({
      message: "An error occurred",
      status: 500,
    });
  }
};