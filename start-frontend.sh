#!/usr/bin/env bash
cd "$(dirname "$0")/frontend"
npm install --legacy-peer-deps
npm run dev
