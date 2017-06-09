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
  local demos_list="$(ls $1)"
  local __result="$2"
  local empty_list=false

  if [[ -z "$demos_list" ]]; then
    empty_list=true
  fi

  eval $__result="$empty_list"
}

function main() {
  determine_demos_dir path
  check_for_demos $path empty_list

  if [[ "$empty_list" == true ]]; then
    echo "Demos dir is empty!" >&2
    exit 1
  fi

  ls $path | xargs -I file ./demo_processing.js "$path/file"
}

main "$@"
