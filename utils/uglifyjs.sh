#!/usr/bin/env bash

run () {
  local bin="uglifyjs"
  if [ -d "node_modules/uglify-js" ]; then
    bin="node_modules/uglify-js/bin/uglifyjs"
  else
    if [ "$(which $bin)" = "" ]; then
      mkdir -p node_modules
      echo "installing uglify-js"
      npm install "uglify-js@1" >/dev/null 2>&1
      bin="node_modules/uglify-js/bin/uglifyjs"
    fi
  fi
  echo "$@" >build/bundle.js
  $bin --verbose build/bundle.max.js >>build/bundle.js
  
}

run "$@"