interface cookieOptionsInterface {
  httpOnly: true;
  secure: boolean;
  sameSite: "strict";
}

export const cookieOptions: cookieOptionsInterface = {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: "strict",
};
