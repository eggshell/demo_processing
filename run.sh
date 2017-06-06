#!/usr/bin/env bash

function determine_demos_dir() {
  local __result="$1"
  local default_dir="$(pwd)/demos"
  local demos_dir="${DEMOS_DIR:-$default_dir}"

  if [[ "$demos_dir" == "$default_dir" ]] && [[ ! -d "$demos_dir" ]]; then
    mkdir "$default_dir"
  fi

  eval $__result="$demos_dir"
}

function check_for_demos() {
  local demos_path="$(ls $1)"
  local __result="$2"
  local empty_path=false

  if [[ -z "$demos_path" ]]; then
    empty_path=true
  fi

  eval $__result="$empty_path"
}

function main() {
  determine_demos_dir path
  check_for_demos $path bool

  if [[ "$bool" == true ]]; then
    echo "Demos dir is empty!" >&2
    exit 1
  fi

  ls $path | xargs -I file ./demo_processing.js "$path/file"
}

main "$@"
