#!/usr/bin/env bash

ls demos | xargs -I file ./demo_processing.js demos/file
