## vixen-network 0.0.1

by boi123212321

Scrape data from VIXEN Network (VIXEN, BLACKED, BLACKED RAW, TUSHY, TUSHY RAW, DEEPER) scenes

### Example installation with default arguments

`config.json`
```json
---
{
  "plugins": {
    "register": {
      "vixen-network": {
        "path": "./plugins/vixen-network/main.ts",
        "args": {}
      }
    },
    "events": {
      "sceneCreated": [
        "vixen-network"
      ],
      "sceneCustom": [
        "vixen-network"
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
    vixen-network:
      path: ./plugins/vixen-network/main.ts
      args: {}
  events:
    sceneCreated:
      - vixen-network
    sceneCustom:
      - vixen-network

---
```
