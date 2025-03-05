import fs from 'fs'

let compose = fs.readFileSync('docker-compose.yaml', { encoding: 'utf-8' })
compose = compose.replaceAll(/maayanlab\/gsfm:[\d\.]+/g, `maayanlab/gsfm:${process.env.npm_package_version}`)
fs.writeFileSync('docker-compose.yaml', compose)