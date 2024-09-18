const baseUrl = 'https://api.dev.pyypl.io';

const url = {
  USER_LOOKUP: `${baseUrl}/users/mobileApp/lookup`,
  COGNITO: 'https://cognito-idp.eu-west-1.amazonaws.com/',
  OTP: `${baseUrl}/users/otp`,
};
export { baseUrl };
export default url;
