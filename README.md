# Login with Google: Svelte + ExpressJs

An example to show login with google with svelte and expressjs.

**Quick Links:**

- My earlier Lucia's example repo of google login with sveltekit only (without express) - https://github.com/sahilrajput03/lucia-example-sveltekit-google-oauth

# Setup in google cloud console

Please add these callback url to your list of callback urls:

- `http://localhost:8080/login/google/callback`
- `https://qr.monktechnoworld.com/login/google/callback`

# Design Decisions

## Backend

#### Why not to use cookies?

Do not use cookies because it makes thing tougher to move:

- Rember it made things tougher with even Abhi\*\*\* on the hand.
- And I can make it work in future anytime I want more secure backend! COOL!

#### Google Callback URL

In backend when we need multiple types of users to signup I make use of multiple routes e.g.,

- 'http://localhost:8080/login/google/callback'
- 'http://localhost:8080/login/google/callback'

Also, if needed you can use multiple google callback urls for e.g., "http://localhost:8080/login/merchant/google/callback", "http://localhost:8080/login/users/google/callback" if we need to handle logins of each type of users separately in different route.
