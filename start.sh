#!/bin/bash
export PATH="$PWD/.node_env/node-v20.12.0-darwin-x64/bin:$PATH"
echo "Starting backend with Node v$(node -v)..."
node server.js
