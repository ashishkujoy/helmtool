#! /usr/bin/env node

const fs = require('fs');
const yaml = require('yaml');
const yargs = require('yargs/yargs')
const args = yargs(process.argv.slice(2)).argv;

const deleteKey = (key, obj) => {
    let last = obj;
    let keys = key.split('.').map(k => k.trim());
    let frontKeys = keys.slice(0, -1);
    let lastKey = keys.slice(-1)[0];

    frontKeys.forEach(k => {
        let newLast = last[k];
        if (typeof newLast === 'undefined') {
            return;
        }
        last = newLast
    });

    delete last[lastKey]
}

const getKeyValPair = () => {
    return args.add.split(';').map(c => {
        let keyVal = c.split('=').slice(0, 2);
        return {
            key: keyVal[0].trim(),
            val: keyVal[1].trim()
        }
    })
}

const keyValToAdd = args.add ? getKeyValPair() : []
const envValue = (fileName) => fileName.split('-')[1].split('.')[0]

const addIn = (yamlContent, fileName) => {
    keyValToAdd.forEach(kv => {
        let last = yamlContent;
        let keys = kv.key.split('.').map(k => k.trim());
        let frontKeys = keys.slice(0, -1);
        let lastKey = keys.slice(-1)[0];

        frontKeys.forEach(k => {
            let newLast = last[k];
            if (typeof newLast === 'undefined') {
                last[k] = {}
                last = last[k]
            } else {
                last = newLast
            }
        });
        last[lastKey] = kv.val.replace('{env}', envValue(fileName));
    })
}


const operateOn = (file) => {
    console.log(`==========================================Processing ${file}==========================================`)
    let fileContent = fs.readFileSync(file, 'utf-8');
    try {
        let parseContent = yaml.parse(fileContent);
        if (args.delete) {
            const keysToDelete = args.delete.split(';').map(key => key.trim())
            keysToDelete.forEach(key => {
                deleteKey(key, parseContent)
            })
        }

        if (args.add) {
            addIn(parseContent, file)
        }

        if (args.dryrun) {
            console.log(yaml.stringify(parseContent))
        } else {
            fs.writeFileSync(file, yaml.stringify(parseContent))
        }
    } catch (e) {
        console.error(e)
        console.error(`Error while parsing ${file} as yaml file`)
    }
    console.log(`==========================================Processing Done ${file}==========================================`)
}


const fileRegex = args.fileRegex ? new RegExp(args.fileRegex) : null

const files = () => {
    if (args.file) {
        return Array.isArray(args.file) ? args.file : [args.file]
    }
    const rootDir = args.root || '.'
    return fs.readdirSync(rootDir).filter(file => {
        if (fileRegex) {
            return file.match(fileRegex)
        } else {
            return true
        }
    }).map(file => args.root ? `${args.root}/${file}` : file);
}
// console.log(files())
files().forEach(file => {
    operateOn(file)
})








