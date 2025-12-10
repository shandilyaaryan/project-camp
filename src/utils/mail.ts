import Mailgen, { type Content } from "mailgen";
import nodemailer from "nodemailer";
import type SMTPTransport from "nodemailer/lib/smtp-transport";

interface sendEmailInterface {
  email: string;
  subject: string;
  mailGenContent: Content;
}

export const transporter = nodemailer.createTransport({
  host: process.env.MAILTRAP_SMTP_HOST,
  port: Number(process.env.MAILTRAP_SMTP_PORT),
  auth: {
    user: process.env.MAILTRAP_SMTP_USER,
    pass: process.env.MAILTRAP_SMTP_PASS,
  },
} as SMTPTransport.Options);

export const sendEmail = async (options: sendEmailInterface) => {
  const mailGenerator = new Mailgen({
    theme: "default",
    product: {
      name: "Project Camp",
      link: "https://project-camp.vercel.app",
    },
  });
  const emailTextual = mailGenerator.generatePlaintext(options.mailGenContent);

  const emailHtml = mailGenerator.generate(options.mailGenContent);
  const mail = {
    from: "mail.projectcamp@projectcamp.com",
    to: options.email,
    subject: options.subject ?? "Project Camp Notification",
    text: emailTextual,
    html: emailHtml,
  };
  try {
    await transporter.sendMail(mail);
  } catch (error) {
    console.error(
      "Email service failed silently. Make sure you have provided your MAILTRAP credentials in the .env file",
    );
    console.error("Error", error);
  }
};

export const emailVerificationMailgenContent = (
  username: string,
  verificationUrl: string,
) => {
  return {
    body: {
      name: username,
      intro:
        "Thanks for your interest in creating a Project-camp account. We are very excited to have you on board",
      action: {
        instructions:
          "To verify your email account please click on the below given button",
        button: {
          color: "#22bc66", // Optional action button color
          text: "Verify your email",
          link: verificationUrl,
        },
      },
      outro:
        "Need help, or have question? Just reply to this email and we would love to help.",
    },
  };
};

export const resetPasswordMailgenContent = (
  username: string,
  passwordResetUrl: string,
) => {
  return {
    body: {
      name: username,
      intro:
        "Select the button below to reset your Project-camp account password.",
      action: {
        instructions:
          "To reset your password please click on the below given button",
        button: {
          color: "#22bc66", // Optional action button color
          text: "Reset your password",
          link: passwordResetUrl,
        },
      },
      outro:
        "If you did not make this request, do nothing and your password will remain the same. No one from Project-camp will ever ask you for your password.",
    },
  };
};
