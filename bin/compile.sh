#!/bin/bash

USE_MINIFIED=$1

PROJECT_NAME=chrome-sdb

SRC_DIR=src
COMPILED_DIR=compiled
TARGET_DIR=target/$PROJECT_NAME

# ensure dirs
mkdir -p $COMPILED_DIR/js
mkdir -p $TARGET_DIR

# compile main
bundle exec dependence $SRC_DIR/coffeescript/src -o $COMPILED_DIR/js -b -c

# compile test
bundle exec dependence $SRC_DIR/coffeescript/test -o $COMPILED_DIR/js/test -b

# copy to public
cp -f $COMPILED_DIR/js/*.js $SRC_DIR/js/
