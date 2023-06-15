# (C) Tim Schupp, Tim Benjamin Software 2023

root_dir := $(shell dirname $(realpath $(firstword $(MAKEFILE_LIST))))

# local: use the local registry ; remote: use the github container registry


ifdef MODE
dev_mode := $(MODE)
else
dev_mode := local
endif


ifndef GIT_USER
	github_user := tbscode
else
	github_user := $(GIT_USER)
endif

ifndef TAG
	tag := latest
else
	tag := $(TAG)
endif


ifeq ($(dev_mode),local)
registry_url := localhost:32000
frontend_image_name := frontend-image
backend_image_name := backend-image
backend_img_sha := $(shell docker images -q $(registry_url)/$(backend_image_name):$(tag))
frontend_img_sha := $(shell docker images -q $(registry_url)/$(frontend_image_name):$(tag))
else
registry_url := ghcr.io
frontend_image_name := $(github_user)/tims-stack-frontend-image
backend_image_name := $(github_user)/tims-stack-backend-image

frontend_img_sha := $(shell docker images -q $(registry_url)/$(frontend_image_name):$(tag))
backend_img_sha := $(shell docker images -q $(registry_url)/$(backend_image_name):$(tag))
endif


kubernetes_namespace := tims-stack-dev
backend_pod_name := backend-deployment
helm_installation_name := tims-stack

# used to configure permission groups for data shared between host and container
user_id := $(shell id -u)
group_id := $(shell id -g)


check_defined = \
    $(strip $(foreach 1,$1, \
        $(call __check_defined,$1,$(strip $(value 2)))))
__check_defined = \
    $(if $(value $1),, \
      $(error Undefined $1$(if $2, ($2))))

authorize_github_push:
	@echo "Authorizing github push"
	$(call check_defined, gha_token, yout 'gha_token' variable is not defined)
	echo $(gha_token) | docker login ghcr.io -u $(github_user) --password-stdin


backend_migrate_static:
	docker run -v $(root_dir)/back:/back -it $(backend_img_sha) python3 manage.py makemigrations
	docker run -v $(root_dir)/back:/back -it $(backend_img_sha) python3 manage.py migrate
	docker run -v $(root_dir)/back:/back -it $(backend_img_sha) python3 manage.py collectstatic --noinput

backend_build:
	docker build --progress=plain -t $(registry_url)/$(backend_image_name):$(tag) -f Dockerfile.back_dev back
	$(MAKE) backend_migrate_static

# we have to build the local backend first to extract statics
backend_build_prod
	$(MAKE) backend_build
	$(MAKE) backend_migrate_static
	docker build --progress=plain -t $(registry_url)/$(backend_image_name)-prod:$(tag) -f Dockerfile.back back

backend_push:
	docker push $(registry_url)/$(backend_image_name):$(tag)
backend_push_prod:
	docker push $(registry_url)/$(backend_image_name)-prod:$(tag)

backend_run:
	echo "Running backend $(backend_img_sha)"
	docker run --init --add-host=host.docker.internal:host-gateway -p 8000:8000 -v $(root_dir)/back:/back -it $(backend_img_sha)
	
test:
	@echo $(dev_mode)
	@echo $(backend_img_sha)
	

modify_values:
	$(call check_defined, eval_str, your 'eval_str' variable is not defined)
	yq -i eval '$(eval_str)' ./helm/values.yaml


backend_build_push:
	$(MAKE) backend_build
	$(MAKE) backend_push

backend_build_push_prod:
	$(MAKE) backend_build_prod
	$(MAKE) backend_push_prod
	
frontend_build:
	docker build --progress=plain -t $(registry_url)/$(frontend_image_name):$(tag) -f Dockerfile.front_dev front

frontend_build_prod:
	docker build --progress=plain -t $(registry_url)/$(frontend_image_name)-prod:$(tag) -f Dockerfile.front front

frontend_push:
	docker push $(registry_url)/$(frontend_image_name):$(tag)
frontend_push_prod:
	docker push $(registry_url)/$(frontend_image_name)-prod:$(tag)
frontend_run:
	docker run --init --add-host=host.docker.internal:host-gateway -p 3000:3000 -v $(root_dir)/front:/front -it $(frontend_img_sha)
	
frontend_build_push:
	$(MAKE) frontend_build
	$(MAKE) frontend_push

frontend_build_push_prod:
	$(MAKE) frontend_build_prod
	$(MAKE) frontend_push_prod
	
capacitor_init:
	npx @capacitor/cli init
	
full_build_deploy:
	$(MAKE) backend_build_push
	$(MAKE) frontend_build_push
	
remote_trigger_git_action_wait_complete:
	$(call check_defined, branch, yout 'branch' variable is not defined)
	$(call check_defined, token, yout 'token' variable is not defined)
	GIT_USER=$(github_user) GIT_BRANCH=$(branch) GHA_TOKEN=$(token) UNIQUE_ID=$(tag) bash ./_scripts/trigger_gh_action_wait_for_completion.sh
	
microk8s_attach_backend:
	microk8s kubectl exec --stdin --tty $(backend_pod_name) -n $(kubernetes_namespace) -- sh
	
microk8s_route_backend_local:
	microk8s kubectl port-forward $(backend_pod_name) 8000:8000 -n $(kubernetes_namespace)
	
microk8s_setup:
	microk8s status
	microk8s start
	microk8s enable helm ingress dns registry cert-manager
	microk8s kubectl create namespace $(kubernetes_namespace)
	
android_start_emulator:
	emulator -avd Resizable_Experimental_API_33 -verbose
	
android_full_build_export:
	# first replace getServersideProps with getServerSidePropsNo, so that we disable loading serverside probs
	docker run -v $(root_dir)/front:/front --entrypoint npm -it $(frontend_img_sha) run static
	docker run -v $(root_dir)/front:/front --entrypoint ./node_modules/.bin/cap -it $(frontend_img_sha) sync
	docker run -v $(root_dir)/front:/front --entrypoint /bin/sh -it $(frontend_img_sha) -c "chown -R $(user_id):$(group_id) ./android"

android_build_install:
	docker run -v $(root_dir)/front:/front --entrypoint npm -it $(frontend_img_sha) run static
	docker run -v $(root_dir)/front:/front --entrypoint ./node_modules/.bin/cap -it $(frontend_img_sha) sync
	docker run -v $(root_dir)/front:/front --entrypoint /bin/sh -it $(frontend_img_sha) -c "chown -R $(user_id):$(group_id) ./android"
	cd front/android && ./gradlew installDebug
	adb shell am start -n com.timschupp.timsstack/com.timschupp.timsstack.MainActivity
	adb logcat -v threadtime com.timschupp.timsstack:*
	
android_cap_liveload:
	cd front && ./node_modules/.bin/cap run android --livereload --external --consolelogs

	
microk8s_status:
	microk8s kubectl get all -n $(kubernetes_namespace)
	
helm_dry_install:
	microk8s helm install --debug $(helm_installation_name) ./helm/ --set rootDir=$(root_dir) --dry-run
	
helm_install:
	microk8s helm dependency build ./helm/
	microk8s helm install --debug $(helm_installation_name) ./helm/ --set rootDir=$(root_dir)

helm_update:
	microk8s helm upgrade --debug $(helm_installation_name) ./helm/ --set rootDir=$(root_dir)
	
start_redis:
	docker run -p 6379:6379 redis:5

helm_uninstall:
	microk8s helm uninstall $(helm_installation_name)

helm_install_prod:
	microk8s helm install --debug $(helm_installation_name) ./helm/ --set rootDir=$(root_dir) --values ./helm-chart/production-values.yaml
	
backend_create_dev_admin:
	docker run -v $(root_dir)/back:/back -it $(backend_img_sha) python3 manage.py shell --command 'from core.tools import get_or_create_base_admin; get_or_create_base_admin()'

helm_install_prod_dry:
	microk8s helm install --debug $(helm_installation_name) ./helm/ --set rootDir=$(root_dir) --values ./helm-chart/production-values.yaml --dry-run