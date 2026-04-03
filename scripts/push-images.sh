#!/usr/bin/env bash

set -Eeuo pipefail

usage() {
  echo "Usage: ./scripts/push-images.sh rachelferns2005 [tag]" >&2
}

log() {
  echo "[push-images] $*"
}

fail() {
  echo "[push-images] ERROR: $*" >&2
  exit 1
}

if [[ $# -lt 1 || $# -gt 2 ]]; then
  usage
  exit 1
fi

DOCKERHUB_USERNAME="$1"
TAG="${2:-latest}"
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
REPO_ROOT="$(cd "${SCRIPT_DIR}/.." && pwd)"

SERVICES=(
  "frontend"
  "gateway"
  "notice-service"
  "auth-service"
)

cd "${REPO_ROOT}"

command -v docker >/dev/null 2>&1 || fail "docker is not installed or not in PATH"

for service in "${SERVICES[@]}"; do
  context_dir="${REPO_ROOT}/${service}"
  dockerfile_path="${context_dir}/Dockerfile"
  image_ref="${DOCKERHUB_USERNAME}/${service}:${TAG}"
  latest_ref="${DOCKERHUB_USERNAME}/${service}:latest"

  [[ -d "${context_dir}" ]] || fail "missing service directory: ${context_dir}"
  [[ -f "${dockerfile_path}" ]] || fail "missing Dockerfile: ${dockerfile_path}"

  log "Building ${service} from ${context_dir}"
  docker build -t "${image_ref}" -f "${dockerfile_path}" "${context_dir}"

  log "Tagging ${image_ref} as ${latest_ref}"
  docker tag "${image_ref}" "${latest_ref}"

  log "Pushing ${image_ref}"
  docker push "${image_ref}"

  if [[ "${TAG}" != "latest" ]]; then
    log "Pushing ${latest_ref}"
    docker push "${latest_ref}"
  fi
done

log "All images built and pushed successfully."
