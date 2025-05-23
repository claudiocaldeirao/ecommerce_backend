#!/bin/sh

branch_name="$1"

if [ -z "$branch_name" ]; then
  echo "Usage: $0 <branch_name>"
  exit 1
fi

# Extract current version from package.json
current_version=$(grep -m1 '"version"' package.json | sed -E 's/.*"version": *"([^"]+)".*/\1/')

if [ -z "$current_version" ]; then
  echo "Could not find version in package.json"
  exit 1
fi

# Validate version format (X.Y.Z or X.Y.Z-suffix)
if ! echo "$current_version" | grep -Eq '^[0-9]+\.[0-9]+\.[0-9]+(-.+)?$'; then
  echo "Invalid version format in package.json. Expected X.Y.Z or X.Y.Z-suffix"
  exit 1
fi

# Extract major, minor, patch (ignore suffix)
major=$(echo "$current_version" | cut -d. -f1)
minor=$(echo "$current_version" | cut -d. -f2)
patch_with_suffix=$(echo "$current_version" | cut -d. -f3)

# Remove suffix from patch (if present)
patch=$(echo "$patch_with_suffix" | cut -d- -f1)

# Increment patch number
patch=$((patch + 1))

new_version="${major}.${minor}.${patch}"

if [ "$branch_name" != "main" ]; then
  # Generate short hash from branch name (using sha1sum)
  if command -v sha1sum >/dev/null 2>&1; then
    hash=$(echo -n "$branch_name" | sha1sum | cut -c1-8)
  elif command -v shasum >/dev/null 2>&1; then
    hash=$(echo -n "$branch_name" | shasum | cut -c1-8)
  else
    hash="hasherr"
  fi

  new_version="${new_version}-${hash}"
fi

echo "$new_version"
