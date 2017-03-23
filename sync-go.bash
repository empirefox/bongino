#!/bin/sh

gen-ts-trans
gen-go-const-ts
gen-go-tag-apis -o src/app/core/api/api.ts -i ~/go/src/github.com/empirefox/bongine/api/api.go

# angular2-json-schema-form angular-tree-component file:../../bongin/bongin-base countdown \
# feathers feathers-memory feathers-reactive ng2-ef-widgets ngx-rating \
# qrcanvas simple-line-icons spark-md5 sort-keys timeago.js

# @types/countdown @types/swiper