#!/bin/bash

# Define the source files
srcComponent="Display.tsx"
srcTest="Display.test.tsx"

echo "Creating 50 copies of $srcComponent and $srcTest"


for i in $(seq 16 50)
do
    # Create copies of the component and test files
    cp "$srcComponent" "DisplayCopy$i.tsx"
    cp "$srcTest" "DisplayCopy$i.test.tsx"
done