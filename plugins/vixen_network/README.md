## vixen_network 0.2.0

by boi123212321

Scrape data from VIXEN Network (VIXEN, BLACKED, BLACKED RAW, TUSHY, TUSHY RAW, DEEPER) scenes

### Arguments

| Name         | Type    | Required | Description                        |
| ------------ | ------- | -------- | ---------------------------------- |
| dry          | Boolean | false    | Whether to commit data changes     |
| deep         | Boolean | false    | Get extra info from scene details  |
| useThumbnail | Boolean | false    | Download & attach scene thumbnail  |
| useChapters  | Boolean | false    | Create scene markers from chapters |

### Example installation with default arguments

`config.json`
```json
---
{
  "plugins": {
    "register": {
      "vixen_network": {
        "path": "./plugins/vixen_network/main.ts",
        "args": {
          "dry": false,
          "deep": true,
          "useThumbnail": false,
          "useChapters": false
        }
      }
    },
    "events": {
      "sceneCreated": [
        "vixen_network"
      ],
      "sceneCustom": [
        "vixen_network"
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
    vixen_network:
      path: ./plugins/vixen_network/main.ts
      args:
        dry: false
        deep: true
        useThumbnail: false
        useChapters: false
  events:
    sceneCreated:
      - vixen_network
    sceneCustom:
      - vixen_network

---
```
