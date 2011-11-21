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
FILE_TO_COPY=$PROJECT_NAME.js
if [ $USE_MINIFIED ]; then
  FILE_TO_COPY=$PROJECT_NAME.min.js
fi
cp -f $COMPILED_DIR/js/$FILE_TO_COPY $SRC_DIR/js/$PROJECT_NAME.js