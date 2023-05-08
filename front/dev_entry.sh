if [ -d "node_modules" ]; then
    echo "node_modules exists not installing"
else
    npm i --save-dev
fi

npm run dev