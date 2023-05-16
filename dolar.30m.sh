#!/bin/bash

# Get current argentinian Dollar value
#
# by Iñaki Abete (inakiabt@gmail.com)
#
# Shows current argentinian Dollar value
# 10 second refresh might be a little too quick. Tweak to your liking.

exit_with_error() {
  echo "err | color=red";
  exit 1;
}
export NVM_DIR=$HOME/.nvm
. /usr/local/opt/nvm/nvm.sh

result=`API_KEY="${DOLAR_API_KEY}" $(nvm which default) $HOME/src/personal/dolar-bitbar-plugin/index.js || exit_with_error`

value=`echo $result | awk '{print $1}' | head -1`

echo "💵"
echo "---";
echo "$result";
