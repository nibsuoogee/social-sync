#!/bin/bash
# scripts/build_ui_types.sh

echo "Building types for ui from auth and backend"

cd auth
bun tsc -p tsconfig.json

cd ../backend
bun tsc -p tsconfig.json

cd ..

echo "Done building types"