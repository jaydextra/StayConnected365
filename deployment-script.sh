#!/bin/bash
cd ${DEPLOYMENT_PATH}
npm install
npm run build
cp -r dist/* public_html/ 