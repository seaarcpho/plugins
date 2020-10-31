## PromisedScene 0.1.0

by Ch00nassid a.k.a: DGs.Ch00, leadwolf

Ask questions and make sure scene parsing is correct

### Arguments

| Name                    | Type    | Required | Description                                                                                                                                       |
| ----------------------- | ------- | -------- | ------------------------------------------------------------------------------------------------------------------------------------------------- |
| useTitleInSearch        | Boolean | false    | When searching TPDB: in auto search, if should use existing scene title. In manual user search, if should prompt user for title and use in search |
| parseActor              | Boolean | true     | Try to find the Actor name in your database within the scenePath string                                                                           |
| parseStudio             | Boolean | true     | Try to find the Studio name in your database within the scenePath string                                                                          |
| manualTouch             | Boolean | true     | If true, will ask questions to manually answer and fill in details.  If false, will agressivly search and automatically populate the vault.       |
| sceneDuplicationCheck   | Boolean | true     | Will notify you of a possible duplicate title that is being imported.  Will not currently stop / correct anything                                 |
| source_settings.actors  | String  | true     | finds the DB file for Actors to determine which actors are currently in your collection                                                           |
| source_settings.studios | String  | true     | finds the DB file for Studios to determine which Studios are currently in your collection                                                         |
| source_settings.scenes  | String  | true     | finds the DB file for Scenes to determine which Scenes are currently in your collection                                                           |

### Example installation with default arguments

`config.json`
```json
---
{
  "plugins": {
    "register": {
      "PromisedScene": {
        "path": "./plugins/PromisedScene/main.ts",
        "args": {
          "useTitleInSearch": false,
          "parseActor": true,
          "parseStudio": true,
          "manualTouch": true,
          "sceneDuplicationCheck": true,
          "source_settings": {
            "actors": "./library/actors.db",
            "studios": "./library/studios.db",
            "scenes": "./library/scenes.db"
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
      path: ./plugins/PromisedScene/main.ts
      args:
        useTitleInSearch: false
        parseActor: true
        parseStudio: true
        manualTouch: true
        sceneDuplicationCheck: true
        source_settings:
          actors: ./library/actors.db
          studios: ./library/studios.db
          scenes: ./library/scenes.db
  events:
    sceneCreated:
      - PromisedScene
    sceneCustom:
      - PromisedScene

---
```
