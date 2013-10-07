#!/bin/bash

## NOTE: Execute this script in the root folder, ex: ~/projects/feedApp/
for f in scripts/git-hooks/*
do
    file=$(basename $f)
    if [ ! -e .git/hooks/$file ]; then
        ln -s ../../scripts/git-hooks/$file .git/hooks/$file
    fi
done
