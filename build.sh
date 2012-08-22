#!/bin/bash

if [ -z "$1" ]; then
	echo "Usage: $0 test|deploy|install_hooks"
elif [ "$1" = "test" ]; then
	echo "Running server tests"
	node server/testSyncer.js
elif [ "$1" = "deploy" ]; then
	echo "Deploying"
	echo "Not implemented"
elif [ "$1" = "install_hooks" ]; then
	echo "Installing hooks..."
	ln -s .commit_hooks/pre-commit .git/hooks/pre-commit
	echo "Finished!"
fi
