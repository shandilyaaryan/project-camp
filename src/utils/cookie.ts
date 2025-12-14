interface authcookieOptionsInterface {
  httpOnly: true;
  secure: boolean;
  sameSite: "strict";
}

export const authCookieOptions: authcookieOptionsInterface = {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: "strict",
};
