### Scenes:

1. Show the login page
[[ Hello everybody. My name is Tim Schupp and in this video I'll present my Web Stack and my submission to the bunnyshell hackathon  ]] (( 6s ))

-> Django logo + Next.js logo

[[ the stack uses a django backend and a nextjs frontend with a lot of opensource libaries and a bunch of custom code and configurations ]] (( 7s ))

Text fly in
-> hyper dynamic
-> cross plattform
-> progressive web apps

[[ the stack is for building hyper dynamic cross plattform progressive web applications, like messengers, online collaboration tools or social media plattforms. The stack also comes with a examplary messenger implementation. ]] (( 8s ))

==== total 21s ====

[[ Everyone can deploy this stack now, for free, and in under 10 minutes of time! ]]

-> show typing in the github url
[[ go to my repo, fork it ]]
-> fork
[[ login or create a bunnyshell account with your github ]]
-> bunnyshell page
[[ create an environment ]]
-> create environment
[[ and deploy it ]]
-> deploy!
timelapse! (( 13s ))

==== total 34s ====

[[ this themplate is meant for development ther is also another properly scalble helm chart template ]]

4. Bunnyshell deployed page
-> click open links, click on the backend link
[[ now lets checkout the stack ]]

[[ the `django` backend takes care of authentication ]] (( 11s ))

==== total 45s ====

5. Show login page and admin login page.

[[ the stack comes with `django-jazzmin` and some logic to automicly register all models and option for maximum flexability. You can create, edit or delete any model. ]] (( 12s ))

-> create model
-> edit model
-> delete model

==== total 57s ====

6. Show a simple code snippet of pre-filtering the queryset.

[[ or by adding permission based queryset filitering you can offer resticred views, for example staff users ]] (( 7s ))

==== total 1:04s ====

7. Frontend & Backend communication ( still in the admin pannel )
[[ there are two means of frontend, backend communication setup, REST api and websocket cannels ]] (( 7s ))

-> import rest_framework
[[ `django-rest-framework` allows super easily defining api views ]]
-> define api view code ( is added )
[[ using `djangorestframework-dataclasses` you can easily define fully typed serializers for mode complex api's ]]
-> add a simple dataclass serializer

[[ or just use a model viewset to turn any model ]]
-> show django model definition of UserProfile
[[ using a cuple lines of code ]]
-> show model viewset code
[[ and you get a full viewset controlled api, I've also added a custom viewset that automaicly handels user and field write permission ]] (( 23s ))

==== total 1:34s ====

8. Show the api doc
-> show `drf-spectacular` slide in
[[ with the magic of `drf-spectacular[sidecar]` you get full derived and adjustable open api schemas for all you api's! ]]
-> In the swagger view show the `/profile` api we just created.
[[ this is the api of the viewset we just created, developers can authenticate and test eh api view in the swagger doc, or view the readble api doc and spec in the redoc view ]] (( 21 s ))
-> show making an api call in the swagger view
-> then show the redoc view

==== total 1:55s ====

9. Show cannels implementation code
-> show `django channels`` text slide in
[[ For websocket implementation the stack uses `django_channels`, it comes with authentication and some custom logic & models for handling user device tracking and notifying ]]
-> show Consumer code
-> show model code
-> show admin pannel

[[ now we'll login as a user over here, see it connected in the admin pannel now ]] (( 20s ))

-> split view login screen clicked
-> split view view connection model in admin pannel visible

==== total 2:15s ====

10. still split screen

[[ now lets edit that users profile ]]

-> show admin changing profile, logged in user device directly updates.

[[ as you have seen the websocket automaticly transmitted the model change to the connected client ]]
[[ this easly achived by using `django-model-utils`'s field tracker and a fiew lines of code in the models save method ]]

-> show `django-model-utils` text slide in
-> show updating the addming the field tracker to UserProfile
-> show updating adding the save method to user profile

[[ now you can easly dynamicly update any client! ]]

11. Show opeing the developer console on the alredy logged in right window
[[ the frontend is a react + next.js app ]]
-> `react` slide in
-> `next.js` slide in

[[ in the web-setting request go to the django server which autenticated users and preloads user data ]]
[[ You can see logged in page doesn't make nay request for data to the backend ]]
-> show reloading the page and zoom in on network tab
[[ page bundes are tiny and page loads are almost instant ]]
[[ now lets open up another browser and request the frontend directly instead ]]
-> show copying frontend url
-> zoon in on network tab
[[ the frontend detects the missing user data an requests it, page is hidrated after the data is fetched ]]
[[ the logic behind that is also what allows us to staticly export this an serve navive apps for android and ios using `capacitor` ]]
-> capacitor slide-in
-> android & ios logo slide in

12. Show the bunnyshell link view again
[[ the stack is setup to automatily build and serve the debug android apk for the current server ]]
-> copy the link, start emulator
[[ simpy download the apk and install it on your android device ]]
-> install app
-> login