#!/bin/bash

PROJECT_NAME=chrome-sdb

SRC_DIR=src
COMPILED_DIR=compiled
TARGET_DIR=target/$PROJECT_NAME

rm -rf $TARGET_DIR
mkdir -p $TARGET_DIR
mkdir -p $TARGET_DIR/images
mkdir -p $TARGET_DIR/css
mkdir -p $TARGET_DIR/js

# copy files
cp -f $SRC_DIR/manifest.json $TARGET_DIR
cp -f $SRC_DIR/*.html $TARGET_DIR
cp -fr $SRC_DIR/images/* $TARGET_DIR/images
cp -fr $SRC_DIR/css/* $TARGET_DIR/css
cp -fr $SRC_DIR/js/* $TARGET_DIR/js
