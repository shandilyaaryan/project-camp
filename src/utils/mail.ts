import Mailgen from "mailgen";

export const emailVerificationMailgenContent = (
  username: string,
  verificationUrl: string,
) => {
  return {
    body: {
      name: username,
      intro:
        "Thanks for your interest in creating a Project-camp account. We are very excited to have you on board",
      actions: {
        instructions:
          "To verify your email account please click on the below given button",
        button: {
          color: "#22bc66", // Optional action button color
          text: "Verify your email",
          link: verificationUrl,
        },
        outro:
          "Need help, or have question? Just reply to this email and we would love to help.",
      },
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
      actions: {
        instructions:
          "To reset your password please click on the below given button",
        button: {
          color: "#22bc66", // Optional action button color
          text: "Reset your password",
          link: passwordResetUrl,
        },
        outro:
          "If you did not make this request, do nothing and your password will remain the same. No one from Project-camp will ever ask you for your password.",
      },
    },
  };
};
