### Tims Stack bunnyshell template

Image builds for this stack make use of `Generic Component`'s so I can build them using the same `Makefile` as for local development.

Images are pushed to a private github container registry, the cluster is automaticly configured to authorize for pulling these images using a fine-grained github access token.