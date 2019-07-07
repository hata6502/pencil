#!/bin/bash
targets=`echo "$@" | sed "s/ /,/g"`
vendor/bin/phpmd ${targets} text cleancode,codesize,controversial,design,naming,unusedcode