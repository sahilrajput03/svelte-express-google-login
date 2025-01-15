import express from 'express'
import cookieParser from 'cookie-parser'
import type { Application, Request, Response } from 'express'
import 'dotenv/config'
import { authorizeUrl, getGoogleUserDetails, oAuth2Client } from './google-oauth'
import jwt from 'jsonwebtoken';

const app: Application = express()

app.use(express.json())
app.use(cookieParser()); // Use cookie-parser middleware

const port = 8080

app.get('/', async (req: Request, res: Response) => {
  res.send('Hello from express + typescript. <br /> <a href="/login/google/merchant">/login/google/merchant</a>')
})

// TODO: Complete this route.
app.get('/login/google/merchant', async (req, res) => {
  // res.cookie('debug', 'google_login_attempt', { maxAge: 15 * 60 * 1000 }); // (15mins) "maxAge": Lifetime of the cookie in milliseconds
  res.redirect(authorizeUrl)
})

app.get('/login/merchant/google/callback', async (req, res) => {
  // console.log('cookies: debug?', req.cookies.debug) // "google_login_attempt"
  // res.clearCookie('debug'); // clear cookie

  const { query }: any = req // For sample output of req.query please check sample.txt file in this directory.

  try {
    const { tokens } = await oAuth2Client?.getToken(query.code)!;
    // console.log("tokens:", tokens) // { access_token, expiry_date, refresh_token, ...more}
    oAuth2Client?.setCredentials(tokens); // (fyi: setting credentials twice wipes out the earlier one and only keeps the latest set credential)

    const user = await getGoogleUserDetails(); // check this function defintion to see sample output
    // TODO: Save this information to database and then we never need to access information for same user ever again.   

    // Clear Credentials from oauth2client instance because we no longer need it
    await oAuth2Client?.setCredentials({});

    // res.json({ message: "success", user }) // (testing only)

    const payload = { userId: user.id, email: user.email };
    const secret = 'your-secret-key';
    const token = jwt.sign(payload, secret, { expiresIn: '1h' });
    const redirectUrl = `http://localhost:5173/auth/google/handle-token?token=${encodeURIComponent(
      token,
    )}`;
    res.redirect(redirectUrl);
    // & Frontend is handling output correctly.

  } catch (error: any) {
    if (error?.response?.data?.error === 'invalid_grant') {
      // Note: `invalid_grant` means you tried to use the same authorization code to get more than one developer token.
      console.error('App Error: Google OAuth Token is expired.');
      res.send('Please restart the process.')
    } else {
      console.log("App Error:", error)
    }
  }
})

app.listen(port, function () {
  console.log(`\n\nApp is listening on port ${port}`)
})
