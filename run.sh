#!/bin/bash

# Change directory to the server directory
cd server

# Start FastAPI server using uvicorn
uvicorn main:app --reload &

# Navigate back to the root directory
cd ..

# Start Electron app (assuming you have a script defined for starting Electron)
yarn dev
