## legalporno-shoot-id 0.0.1

by boi123212321

Extract Legalporno shoot IDs (e.g. GIO482) from video names

### Arguments

| Name    | Type    | Required | Description                                 |
| ------- | ------- | -------- | ------------------------------------------- |
| dry     | Boolean | false    | Whether to commit data changes              |
| setName | Boolean | false    | Whether to set scene name to found shoot ID |

### Example installation with default arguments

`config.json`
```json
---
{
  "plugins": {
    "register": {
      "legalporno-shoot-id": {
        "path": "./plugins/legalporno-shoot-id/main.ts",
        "args": {
          "dry": false,
          "setName": false
        }
      }
    },
    "events": {
      "sceneCreated": [
        "legalporno-shoot-id"
      ],
      "sceneCustom": [
        "legalporno-shoot-id"
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
    legalporno-shoot-id:
      path: ./plugins/legalporno-shoot-id/main.ts
      args:
        dry: false
        setName: false
  events:
    sceneCreated:
      - legalporno-shoot-id
    sceneCustom:
      - legalporno-shoot-id

---
```
