
#!/bin/bash

source  ~/.bashrc
nvm use v8.10.0
node -v

npm install && npm run build

