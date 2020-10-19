## traxxx 0.1.0

by leadwolf

Scrape data from traxxx

### Documentation

## Plugin Details

This plugin retrieves data from Traxxx.

### Studios

* The plugin returns the following properties:
    * &#x60;name&#x60; : name of the studio
    * &#x60;description&#x60; : description of the studio
    * &#x60;parent&#x60;: the parent channel/network


- In Traxxx, studios can either be channels or networks. Think of a tree: studios with children are networks, and studios with no children are channels.

- When the plugin is run for a name, that can be either a channel or a network, the plugin will return the data according to the &#x60;args.studios.channelPriority&#x60; config. When &#x60;true&#x60;, the channel data will be returned, and the network, when &#x60;false&#x60;.  
In this case, when &#x60;args.studios.uniqueNames&#x60; is &#x60;true&#x60;, the name will be appended with the appropriate suffix &#x60;args.studios.channelSuffix&#x60; &amp; &#x60;args.studios.channelSuffix&#x60;. Otherwise, the name will be returned as is in Traxxx.

- If the plugin receives a studio name that already has the same suffix as in the args, it will only try to search and return the data for that type indicated by the suffix.

- The plugin supports being piped data. This means, if you have a studio plugin &#x60;A&#x60; that runs before this plugin &#x60;B&#x60;, you can make this plugin NOT overwrite properties that plugin &#x60;A&#x60; already returned values for.  
**WARNING**: this is not the same as values that already exist for the studio. Example: you manually entered a description in the web UI and then run the plugin. If the plugin finds a channel/network with a description, that will become the new one.

### Arguments

| Name                      | Type     | Required | Description                                                                                                                                                               |
| ------------------------- | -------- | -------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| dry                       | Boolean  | false    | Whether to commit data changes                                                                                                                                            |
| studios                   | Object   | true     | Configuration for studio events                                                                                                                                           |
| studios.channelPriority   | Boolean  | false    | When the studio type is unknown, and the name corresponds to both a channel &amp; a network, whether to prefer the channel or the network                                     |
| studios.uniqueNames       | Boolean  | false    | When the studio name corresponds to both a channel &amp; a network, whether to append suffixes to the name to avoid conflicts                                                 |
| studios.channelSuffix     | String   | false    | When returning a channel name that also corresponds to a network, will be appended to the name. WARNING: spaces between the name &amp; suffix will not be automatically added |
| studios.networkSuffix     | String   | false    | When returning a network name that also corresponds to a channel, will be appended to the name. WARNING: spaces between the name &amp; suffix will not be automatically added |
| studios.whitelist         | String[] | false    | Array of data fields to pick (possible values: &#x27;name&#x27;, &#x27;description&#x27;, &#x27;parent&#x27;)                                                                                           |
| studios.blacklist         | String[] | false    | Array of data fields to omit (for values see whitelist)                                                                                                                   |
| studios.whitelistOverride | String[] | false    | Array of data fields to pick, when values already exist from a piped plugin (WARNING: not the same thing as existing values of the scene) (for values see whitelist)      |
| studios.blacklistOverride | String[] | false    | Array of data fields to omit, when values already exist from a a piped plugin (WARNING: not the same thing as existing values of the scene) (for values see whitelist)    |

### Example installation with default arguments

`config.json`
```json
---
{
  "plugins": {
    "register": {
      "traxxx": {
        "path": "./plugins/traxxx/main.js",
        "args": {
          "dry": false,
          "studios": {
            "channelPriority": true,
            "uniqueNames": true,
            "channelSuffix": " (Channel)",
            "networkSuffix": " (Network)",
            "whitelist": [],
            "blacklist": [],
            "whitelistOverride": [],
            "blacklistOverride": []
          }
        }
      }
    },
    "events": {
      "studioCreated": [
        "traxxx"
      ],
      "studioCustom": [
        "traxxx"
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
    traxxx:
      path: ./plugins/traxxx/main.js
      args:
        dry: false
        studios:
          channelPriority: true
          uniqueNames: true
          channelSuffix: " (Channel)"
          networkSuffix: " (Network)"
          whitelist: []
          blacklist: []
          whitelistOverride: []
          blacklistOverride: []
  events:
    studioCreated:
      - traxxx
    studioCustom:
      - traxxx

---
```
