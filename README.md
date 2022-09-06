# metalet

Metalet is a Metaverse Chain wallet.

Wallet keys are stored in localStorage, optionally encrypted by a password.

See https://www.mvc.space/metalet.html or the Chrome Extension to install.

## Building locally
require Node.js version 14
yarn
yarn build
Uncompressed builds can be found in /dist, install it by Chrome in developer mode.

## Develop

there are some info about how to develop this project.

1. the client page use `sendMessageFromExtPageToBackground` method to send the message to the `background.js`, and then `background.js` will send another message to feedback.
2. the account will store in `indexDb`, when you create a new account, the program will save the user info into the `localstorage` and `indexDb`.
3. we will inject a `content-script` into third-part page, then you can use metatelet api any where.
