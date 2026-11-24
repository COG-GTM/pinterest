# Contributing

Thank you for your interest in contributing! Please feel free to put up a PR for any issue or feature request.
Even if you have little to no experience with Angular, I'll be more than happy to help. :)

## Setup

1. Fork the repo
2. Clone your fork
3. Make a branch for your feature or bug fix
4. `yarn install && (cd mock-api && npm install)`
5. Run `npm run mock-api` and, in another shell, `npm start`
6. Open `localhost:4200` in a browser
7. Work your magic
8. Run `npx ng build` and `npx ng test --watch=false` to make sure nothing is broken
9. To test service worker changes:
  * `npm run build--prod` to build `dist/` and generate the service worker file
  * `npm run static-serve` to load the application along with the service worker asset using [live-server](https://github.com/tapio/live-server)
10. Add yourself to the [contributor's list](https://github.com/aviabird/pinterest#contributors) in the README!
11. Commit your changes and reference the issue you're addressing (for example: `git commit -am 'Commit message. Closes #5'`)
13. Push your branch to your fork
14. Create a pull request from your branch on your fork to `master` on this repo
15. Have your branch get merged in! :star2:

If you experience a problem at any point, please don't hesitate to file an issue or send me a message!
