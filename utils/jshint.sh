#!/usr/bin/env bash

program () {
  local bin="$1"
  if [ -d "node_modules/$bin" ]; then
    bin="$2"
  else
    if [ "$(which $bin)" = "" ]; then
      mkdir -p node_modules
      echo "installing $1"
      npm install $bin >/dev/null 2>&1
      bin="$2"
    fi
  fi
  echo $bin
}

run () {
  local bin="$(program 'jshint' 'node_modules/jshint/bin/jshint')"
  local folder=$1
  local js=""
  # drop some info in the stdout
  echo "linting $f ... "
  for f in $folder/*; do
    # if it's a fodler, go for recursion
    if [ -d "$f" ]; then
      run "$f"
    else
      # grab .js files only
      js=$(echo "$f" | sed 's/.js//')
      if [ "$js" != "$f" ]; then
        # finally use jshint to verify the file
        $bin "$f"
        # in case there was an error
        if [[ $? -ne 0 ]] ; then
          exit 1
        fi
      fi
    fi
  done
}

run src