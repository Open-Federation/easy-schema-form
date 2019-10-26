#!/bin/bash

# Release branch
master="master"
prefix="v"
version="" 

#release 主版本（major）,次版本（ minor） or 修订版（patch） 规则生成版本号
if [ $release ]; then
  version=$release
  echo "release-version:$version"
else
  version="patch"
  echo "release-version:$version"
fi

if [ $branch ]; then
  master=$branch
  echo "branch:$branch"
fi

git pull origin $master
echo "Current pull origin $master."

# Auto generate version number and tag
standard-version -r $version --tag-prefix $prefix

git push --follow-tags origin $master

echo "Git push origin $master"
echo "Release finished."

npm run build

echo "npm run build finished."