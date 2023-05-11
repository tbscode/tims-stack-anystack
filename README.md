### tim's cross plattfor universal fullstack setup

this is based on my [earlier kubernetes tiny-django-nextjs stack](https://github.com/tbscode/tiny-django).
On top of that is adds a basic setup for usage with capacitor to build ios and android hybrid-native application.

### Apps using this stack ( or a similar earlier version of it )

- Little World web-app [`little-world.com`](https://little-world.com)
- Tum.ai hackathon submission AnyChat [`(git) anychat.t1m.me`](https://github.com/tbscode/anysearch-stack) ([`deployed app`](https://anychat.t1m.me) this will only stay online for a limited time 08.05.23 )
- Global Game Jam 2023 submission ( backend uses some of this stacks technologies ) [`rude roots (git)`](https://github.com/tbscode/ggj2023) ( mutliplayer online game using django channels for websocket communication, currently not deployed anymore )

### future developments

- [ ] add electron for desktop applications
- [ ] add simple to use caching / online check layer that allowes to use most app features offline

#### Android

Install android studio, open project `/front/android` run the app in the emulator!

#### IOS

I don't like being forced to buy a apple devide just to be able to develop ios applications ( f\*\*k u apple! ;) ).
A simple way to cheat this restriction is to just run OSX from a docker container using: https://github.com/sickcodes/Docker-OSX

This is sufficient for testing the ios application but not for puplishing it to the apple store, cause apple will quickly lock your apple-id when used in such a virtualization environment.
