import express from 'express'
import type { Application, Request, Response } from 'express'
import 'dotenv/config'
import { getGoogleUserDetails, initOAuth2Client, oAuth2Client } from './initGoogleOauth'
import jwt from 'jsonwebtoken';

initOAuth2Client()

const app: Application = express()

app.use(express.json())

const port = 8080

app.get('/', async (req: Request, res: Response) => {
  res.send('Hello from express + typescript')
})

app.get('/login/google/callback', async (req, res) => {
  const { query }: any = req // For sample output of req.query please check sample.txt file in this directory.

  try {
    const { tokens } = await oAuth2Client?.getToken(query.code)!;
    // console.log("tokens:", tokens) // { access_token, expiry_date, refresh_token, ...more}
    oAuth2Client?.setCredentials(tokens);

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
