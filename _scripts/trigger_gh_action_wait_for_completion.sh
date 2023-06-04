#!/bin/bash

EXIT_STATUS=0

function dispatch_build_push_wait_complete {
    # Trigger the workflow
    export WORKFLOW_FILE="$1"
    export GIT_USER="$GIT_USER"
    export GHA_TOKEN="$GHA_TOKEN"
    export GIT_BRANCH="$GIT_BRANCH"
    export UNIQUE_ID="$UNIQUE_ID"
    export WORKFLOW_CALLBACK="https://api.github.com/repos/$GIT_USER/tims-stack-anystack/actions/workflows/$WORKFLOW_FILE/dispatches"
    export WORKFLOW_RUNS="https://api.github.com/repos/$GIT_USER/tims-stack-anystack/actions/workflows/$WORKFLOW_FILE/runs"
    echo $WORKFLOW_CALLBACK
    echo $WORKFLOW_FILE

    response=$(curl -X POST \
      -H "Accept: application/vnd.github+json" \
      -H "Authorization: Bearer $GHA_TOKEN" \
      $WORKFLOW_CALLBACK \
      -d "{\"ref\": \"$GIT_BRANCH\", \"inputs\": {\"branch\": \"$GIT_BRANCH\", \"git_user\": \"tbscode\", \"unique_id\": \"$UNIQUE_ID\"}}" \
      -w "\n%{http_code}" -s)
    
    sleep 10

    # Get the created workflow run ID
    http_code=$(tail -n 1 <<< "$response")
    if [ "$http_code" -ne 204 ]; then
      echo "Error triggering the workflow."
      exit 1
    fi

    # Poll the API to check workflow status
    while true; do
      # Get the latest workflow run

        latest_run=$(curl -X GET \
            -H "Accept: application/vnd.github+json" \
            -H "Authorization: token $GHA_TOKEN" \
            $WORKFLOW_RUNS \
            -s)

      # Get the status and conclusion of the latest workflow run
      status=$(jq -r '.workflow_runs[0].status' <<< "$latest_run")
      conclusion=$(jq -r '.workflow_runs[0].conclusion' <<< "$latest_run")

      if [ "$status" == "completed" ]; then
        if [ "$conclusion" == "success" ]; then
          echo "Workflow '$WORKFLOW_FILE' completed successfully."
          exit 0
        else
          echo "Workflow '$WORKFLOW_FILE' completed with an error."
          EXIT_STATUS=1
          exit 1
        fi
      fi

      # Sleep for a while before polling again
      sleep 10
    done
}

dispatch_build_push_wait_complete "build_frontend_push.yaml" &
dispatch_build_push_wait_complete "build_backend_push.yaml" &

# Wait for both functions to complete
wait

if [ "$EXIT_STATUS" -ne 0 ]; then
  echo "One of the functions failed."
  exit 1
fi

echo "Both functions are done."