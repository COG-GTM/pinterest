<p align="center">
  <a href="https://angular2-hn.firebaseapp.com">
    <img alt="PinWork App Logo" title="Angular 2 PinWork App" src="http://res.cloudinary.com/mally-in/image/upload/v1486182326/Screen_Shot_2017-02-04_at_9.51.23_AM_jyckax.png" width="200">
  </a>
</p>

<p align="center">
  PinWork built with ❤️ using Angular2, ngrx store, observables and reactive forms.
</p>

<p align="center">
	<a href="/CONTRIBUTING.md"><img alt="PRs Welcome" src="https://img.shields.io/badge/PRs-welcome-brightgreen.svg"></a>
</p>

<p align="center">
  <a href="https://aviabird.github.io/pinterest/">
    DEMO HERE
    <img alt="PinWork App Logo" title="Angular 2 PinWork App" src="http://res.cloudinary.com/mally-in/image/upload/v1486183305/Screen_Shot_2017-02-04_at_10.10.43_AM_ysuihi.png">
  </a>
</p>

## Setting up

##### Clone the repo

```
$ git clone https://github.com/aviabird/pinterest.git
$ cd pinterest
```

##### Install dependencies (Node >= 22.22)
```
$ yarn install
$ (cd mock-api && npm install)
```

## Development server
The original backend (pinwork-api.herokuapp.com) is retired, so development runs against the local mock API:
```
$ npm run mock-api   # http://127.0.0.1:3000
$ npm start          # ng serve with proxy.conf.json -> http://localhost:4200/
```
The app reloads automatically when you change any of the source files.

## Author

 **[Pankaj Kumar Rawat]()**

 - [github/pkrawat1](https://github.com/pkrawat1)
 - [twitter/pkrawat1](https://twitter.com/pkrawat1)
 
## License
[MIT License](LICENSE.md)
