# fileparser 0.1.0

by arcadianCdr

Automatically extracts scene details from your library's file and directory structure.

Supported properties are: `release date`, `studio`, `name`, `actors`, `movie` and `labels`.

The plugin works by recognizing patterns in your files:
- a built-in pattern identifies dates and work "out-of-the-box". 
- for custom patterns (like studio, actors or movie) that are specific to your naming convention, a little bit of configuration is needed to "tell the plugin" how to recognize them.

fileparser uses the standard "regular expression" standard (regex). If you don't know the regex syntax, there are many examples below that can be reused with little to no understanding of regex.

## Configuration - not your typical plugin

A consistent and uniform naming convention accross a whole media library is extremely unlikely. Therefore, fileparser supports not one, but multiple `parserconfig` files. They are placed alongside your media files, directly into the library. 

A configuration file applies to all files and subdirectories below it: the same directory or anything deeper in the dir structure. 

Config files can also be nested. In this case, the deepest and most specific config is always used. 

Configs are searched and loaded dynamically when the plug-in is executed (typically when pv scans for new files). They can be added, modified or removed while pv is running (although I would advise against modifications in the middle of a scan for new files).

## Arguments

Since most of the customisation is done within `parserconfig` files, the plug-in arguments are reduced to the minimum:

| Name       | Type    | Required | Description                            |
| ---------- | ------- | -------- | -------------------------------------- |
| dry        | Boolean | false    | Whether to commit data changes.        |
| parseDate  | Boolean | false    | whether to parse release dates. Defaults to true       |

## Example installation with default arguments

`config.json`
```json
---
{
  "plugins": {
    "register": {
      "fileparser": {
        "path": "./plugins/fileparser/main.ts",
        "args": {
          "dry": false,
          "parseDate": true
        }
      }
    },
    "events": {
      "sceneCreated": [
        "fileparser"
      ]
    }
  }
}
---
```

`config.yaml`
```yaml
---
plugins:
  register:
    fileparser:
      path: "./plugins/fileparser/main.ts"
      args:
        dry: false
        parseDate: true
  events:
    sceneCreated:
    - fileparser
---
```

## `parserconfig` file structure

TODO

## `parserconfig` examples

TODO
