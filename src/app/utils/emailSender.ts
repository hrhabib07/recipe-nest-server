import * as fs from "fs";
import * as path from "path";
import { promisify } from "util";
import Handlebars from "handlebars";
import nodemailer from "nodemailer";
import config from "../config";
import AppError from "../errors/AppError";
import httpStatus from "http-status";

const ReadFile = promisify(fs.readFile);

const sendEmail = async (email: string, resetLink: string, subject: string) => {
  const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 587,
    secure: false, // Use `true` for port 465, `false` for all other ports
    auth: {
      user: config.sender_email,
      pass: config.sender_app_password,
    },
    tls: {
      rejectUnauthorized: false,
    },
  });

  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <style>
        body {
          font-family: Arial, sans-serif;
          margin: 0;
          padding: 0;
          background-color: #f4f4f4;
        }
        .container {
          width: 100%;
          max-width: 600px;
          margin: 0 auto;
          background-color: #ffffff;
          padding: 20px;
          box-shadow: 0px 4px 12px rgba(0, 0, 0, 0.1);
        }
        .header {
          text-align: center;
          padding: 20px 0;
        }
        .header img {
          width: 150px;
        }
        .content {
          padding: 20px;
          text-align: center;
        }
        .content p {
          font-size: 16px;
          color: #333333;
        }
        .button {
          display: inline-block;
          padding: 12px 25px;
          margin: 20px 0;
          font-size: 16px;
          color: #ffffff;
          background-color: #ff6f61;
          text-decoration: none;
          border-radius: 5px;
        }
        .footer {
          text-align: center;
          padding: 10px;
          font-size: 12px;
          color: #999999;
        }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <img src="https://your-logo-url.com/logo.png" alt="Recipe Nest Logo">
        </div>
        <div class="content">
          <h2>Reset Your Password</h2>
          <p>Hi,</p>
          <p>We received a request to reset your password for your Recipe Nest account. Click the button below to reset it.</p>
          <a href="${resetLink}" class="button">Reset Password</a>
          <p>If you didn’t request a password reset, please ignore this email. The link will expire in 10 minutes.</p>
        </div>
        <div class="footer">
          <p>&copy; 2024 Recipe Nest. All Rights Reserved.</p>
        </div>
      </div>
    </body>
    </html>
  `;

  await transporter.sendMail({
    from: '"Recipe Nest" <mdhabibur.hr7@gmail.com>', // sender address
    to: email, // list of receivers
    subject, // Subject line
    html, // HTML body
  });
};

const createEmailContent = async (data: object, templateType: string) => {
  try {
    const templatePath = path.join(
      process.cwd(),
      `src/views/${templateType}.template.hbs`
    );
    const content = await ReadFile(templatePath, "utf8");

    const template = Handlebars.compile(content);

    return template(data);
  } catch (error) {
    throw new AppError(
      httpStatus.INTERNAL_SERVER_ERROR,
      (error as Error).message
    );
  }
};

export const EmailHelper = {
  sendEmail,
  createEmailContent,
};
