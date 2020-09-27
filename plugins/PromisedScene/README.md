## PromisedScene 0.1.0

by Ch00nassid a.k.a: DGs.Ch00

Ask questions and make sure scene parsing is correct

### Arguments

| Name                    | Type    | Required | Description                                                                                                                                 |
| ----------------------- | ------- | -------- | ------------------------------------------------------------------------------------------------------------------------------------------- |
| parseActor              | Boolean | true     | Try to find the Actor name in your database within the scenePath string                                                                     |
| parseStudio             | Boolean | true     | Try to find the Studio name in your database within the scenePath string                                                                    |
| ManualTouch             | Boolean | true     | If true, will ask questions to manually answer and fill in details.  If false, will agressivly search and automatically populate the vault. |
| SceneDuplicationCheck   | Boolean | true     | Will notify you of a possible duplicate title that is being imported.  Will not currently stop / correct anything                           |
| source_settings.Actors  | String  | true     | finds the DB file for Actors to determine which actors are currently in your collection                                                     |
| source_settings.Studios | String  | true     | finds the DB file for Studios to determine which Studios are currently in your collection                                                   |
| source_settings.Scenes  | String  | true     | finds the DB file for Scenes to determine which Scenes are currently in your collection                                                     |

### Example installation with default arguments

`config.json`
```json
---
{
  "plugins": {
    "register": {
      "PromisedScene": {
        "path": "./plugins/PromisedScene/main.js",
        "args": {
          "parseActor": true,
          "parseStudio": true,
          "ManualTouch": true,
          "SceneDuplicationCheck": true,
          "source_settings": {
            "Actors": "./library/actors.db",
            "Studios": "./library/studios.db",
            "Scenes": "./library/scenes.db"
          }
        }
      }
    },
    "events": {
      "sceneCreated": [
        "PromisedScene"
      ],
      "sceneCustom": [
        "PromisedScene"
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
    PromisedScene:
      path: ./plugins/PromisedScene/main.js
      args:
        parseActor: true
        parseStudio: true
        ManualTouch: true
        SceneDuplicationCheck: true
        source_settings:
          Actors: ./library/actors.db
          Studios: ./library/studios.db
          Scenes: ./library/scenes.db
  events:
    sceneCreated:
      - PromisedScene
    sceneCustom:
      - PromisedScene

---
```
