# ngmp

node ./utils/streams.js --action=reverse
node ./utils/streams.js --action=transform
node ./utils/streams.js --action=outputFile  --file=data/test.csv
node ./utils/streams.js --action=convertFromFile
node ./utils/streams.js --action=convertToFile  --file=data/test.csv
node ./utils/streams.js --action=cssBundler  --path=data
node ./utils/streams.js --help