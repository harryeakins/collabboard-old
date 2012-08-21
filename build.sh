#!/bin/bash

if [ -z "$1" ]; then
	echo "Usage: $0 test|deploy"
elif [ "$1" = "test" ]; then
	echo "Running server tests"
	node server/testSyncer.js
elif [ "$1" = "deploy" ]; then
	echo "Deploying"
	echo "Not implemented"
fi