import { OAuth2Client } from 'google-auth-library';

const { GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET, GOOGLE_REDIRECT_URI } = process.env

const requiredEnvValues = []
if (!GOOGLE_CLIENT_ID) {
  requiredEnvValues.push("GOOGLE_CLIENT_ID")
}
if (!GOOGLE_CLIENT_SECRET) {
  requiredEnvValues.push("GOOGLE_CLIENT_SECRET")
}
if (!GOOGLE_REDIRECT_URI) {
  requiredEnvValues.push("GOOGLE_REDIRECT_URI")
}
if (requiredEnvValues.length !== 0) {
  console.log('ERROR: Please provide these env values:', requiredEnvValues.join(', '))
}

// TODO: handle undefined for above values.

// Google docs on using this library: https://developers.google.com/identity/protocols/oauth2
// Docs: https://www.npmjs.com/package/google-auth-library
// export let oAuth2Client = null as null | OAuth2Client;
export let oAuth2Client = new OAuth2Client(
  GOOGLE_CLIENT_ID,
  GOOGLE_CLIENT_SECRET,
  GOOGLE_REDIRECT_URI, // Note: Giving redirectUrl here is requried otherwise error is thrown when we call `oAuth2Client.getToken()`
);

// Generate the url that will be used for the consent dialog.
export const authorizeUrl = oAuth2Client?.generateAuthUrl({
  access_type: 'offline',
  scope: 'https://www.googleapis.com/auth/userinfo.profile https://www.googleapis.com/auth/userinfo.email',
});
// console.log("🚀 authorizeUrl:", authorizeUrl)
// Note: This url is always same unless you change your `client_id` and `redirect_url` because it has these two inside it.
// https://accounts.google.com/o/oauth2/v2/auth?access_type=offline&scope=https%3A%2F%2Fwww.googleapis.com%2Fauth%2Fuserinfo.profile%20https%3A%2F%2Fwww.googleapis.com%2Fauth%2Fuserinfo.email&response_type=code&client_id=986529280687-h9odm5k44ekvojklmofmet7vjrubibnf.apps.googleusercontent.com&redirect_uri=http%3A%2F%2Flocalhost%3A8080%2Flogin%2Fgoogle%2Fcallback


// Function to fetch user details using the OAuth2 client
type UserDetails = {
  id: string;
  email: string;
  verified_email: boolean;
  name: string;
  given_name: string;
  family_name: string;
  picture: string;
  locale: string;
  hd: string;
};

export async function getGoogleUserDetails() {
  if (!oAuth2Client) {
    throw new Error('*App Error: oAuth2Client is undefined!')
  }
  const { data } = await oAuth2Client.request({
    url: 'https://www.googleapis.com/oauth2/v1/userinfo',
  });
  return data as Promise<UserDetails>;
}
/**
 * Sample output from `getGoogleUserDetails` function:
 * ==================================
    {
      id: '115934040160586535115', // * googleAccountId
      email: 'sahilrajput03@gmail.com', // *
      verified_email: true,
      name: 'Sahil Rajput', // *
      given_name: 'Sahil',
      family_name: 'Rajput',
      picture: 'https://lh3.googleusercontent.com/a/ACg8ocL0AGuLK1FPIan_63GYs5TkxK3iJLeAio80eR6s2SrQJQ3qHFeb=s96-c' // *
    }
 */