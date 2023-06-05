# Tims Stack bunnyshell template

Image builds for this stack make use of `Generic Component`'s so I can build them using the same `Makefile` as for local development.

Images are pushed to a private github container registry, the cluster is automaticly configured to authorize for pulling these images using a fine-grained github access token.

## Setup:

1. Fork the root repo.
2. Login to bunnyshell using github
3. Generate a fine-grained github token with permission to access the repo and write packages. ( `Settings > `)

## Bunnyshell Components

### Image Manager (`image-manager`)

Attaches to any github account using a access token ( best: fine-grained github token with access **only** to the forked repo and reading / writing packages ). This token will also automaticly be configured with you cluster to autorize pulling the images from you private github registry.

**Deploying** this container automaticly triggers a github workflow to build your images and then push them to your github registry. The container will wait for the github actions to complete by polling the workflow api's and will raise an error if any build fails.

**Destroying** this images automaticly deletes the images from your registry.

### Backend (`django-channels-rest`)

Installs part of the helm chart for deploying the backend.
Is confired with [components outlined here](TODO).

All components [use opensource licenses]()

**stopping** this will decrese pods to 0. Starting will increse pods to 2 so concurreny of tasks and celery workers can be tested.

### Frontend (`react-nextjs-capacitor`)



### Database (`postgresql-db`)

### Redis (`redis-db`)