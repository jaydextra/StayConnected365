#!/bin/bash
export NVM_DIR="$HOME/.nvm"
[ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"
cd ${DEPLOYMENT_PATH}
npm install
npm run build
cp -r dist/* public_html/ 