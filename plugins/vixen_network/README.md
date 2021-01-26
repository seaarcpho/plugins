## vixen_network 0.0.1

by boi123212321

Scrape data from VIXEN Network (VIXEN, BLACKED, BLACKED RAW, TUSHY, TUSHY RAW, DEEPER) scenes

### Example installation with default arguments

`config.json`
```json
---
{
  "plugins": {
    "register": {
      "vixen_network": {
        "path": "./plugins/vixen_network/main.ts",
        "args": {}
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
      args: {}
  events:
    sceneCreated:
      - vixen_network
    sceneCustom:
      - vixen_network

---
```
