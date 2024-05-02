#!/bin/bash

# Define the source files
srcComponent="Display.tsx"
srcTest="Display.test.tsx"

echo "Creating 500 copies of $srcComponent and $srcTest"


# Loop to create 500 copies
for i in $(seq 1 500)
do
    # Create copies of the component and test files
    cp "$srcComponent" "DisplayCopy$i.tsx"
    cp "$srcTest" "DisplayCopy$i.test.tsx"
done