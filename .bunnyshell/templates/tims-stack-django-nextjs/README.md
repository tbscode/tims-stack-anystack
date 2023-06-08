# Tims Stack bunnyshell template

Image builds for this stack make use of `Generic Component`'s so I can build them using the same `Makefile` as for local development.

Images are pushed to a private github container registry, the cluster is automaticly configured to authorize for pulling these images using a fine-grained github access token.

## Detailed stack overview

For a detailed overview of the stack, [please checkout the root README of the stack repo](https://github.com/tbscode/tims-stack-anystack/blob/main/README.md)

## Setup:

> NOTE: this setup automaticly triggers the build workflows in your github account and authenticates the kluster to pull your images using your github token, there is an [alternate template](../../../.bunnyshell/templates/tims-stack-django-nextjs-static/README.md) that comes with static prebuild images and should also work on the bunnyshell cluster. This doesn't require to add an github access token to the environment vars.

1. Fork the root repo.
2. Login to bunnyshell using github
3. Generate a fine-grained github token with permission to access the repo and write packages. ( `Settings > Developer Settings > Finegrained Access token`)

## Bunnyshell Components

These are the global stack components, not that the individual implementation are also heavily customized for rapid api and consumer development. ( check the repo readme for more info ).

### Image Manager (`image-manager`)

Attaches to any github account using a access token ( best: fine-grained github token with access **only** to the forked repo and reading / writing packages ). This token will also automaticly be configured with you cluster to autorize pulling the images from you private github registry.

**Deploying** this container automaticly triggers a github workflow to build your images and then push them to your github registry. The container will wait for the github actions to complete by polling the workflow api's and will raise an error if any build fails.

**Destroying** this images automaticly deletes the images from your registry.

### Database (`postgres`)

Simple postgress db setupup to automaticly connect to from the django backend. The backend will also automaticly populate this with some test users.

### Redis (`redis`)

Simple redis server for celey worker communication and websocket channel communication. This is required for horizontally scaling the backend container without any concurrency issues.

### Backend (`backend`)

The core of the application: A horizontally scallable django container that manages the whole application state and communication.

Installs part of the helm chart for deploying the backend. Is confired with [components outlined here](TODO).

All components [use opensource licenses]().

**stopping** this will decrese pods to 0. Starting will increse pods to 2 so concurreny of tasks and celery workers can be tested.

### Frontend (`frontend`)

Also horizontally scalable react + nextjs + capacitor setup. In web context the backend dynamicly requests rendered pages with preloaded user data.
While the capacitor integration and some custom script allow to also export this as a static app and build it for android and ios. Other capacitor prugins also allow interacting with native functions. 

There is a bunch of custom implementations for managing application state, chache fallback data and websocket connection, [please check here for further information]()


