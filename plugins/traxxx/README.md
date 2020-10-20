## traxxx 0.1.0

by leadwolf

Scrape data from traxxx

### Documentation

## Plugin Details

This plugin retrieves data from Traxxx.

### Studios

* The plugin returns the following properties:
    * `name` : name of the studio
    * `description` : description of the studio
    * `thumbnail` : thumbnail of the studio
    * `aliases` : aliases of the studio
    * `parent`: the parent channel/network
    * `custom` : custom fields:
        * `traxxx_id` : the matched id
        * `traxxx_type` : the type of channel/network
        * `url` : the url of the studio


- In Traxxx, studios can either be channels or networks. Think of a tree: studios with children are networks, and studios with no children are channels.

- When the plugin is run for a name, that can be either a channel or a network, the plugin will return the data according to the `args.studios.channelPriority` config. When `true`, the channel data will be returned, and the network, when `false`.  
In this case, when `args.studios.uniqueNames` is `true`, the name will be appended with the appropriate suffix `args.studios.channelSuffix` & `args.studios.channelSuffix`. Otherwise, the name will be returned as is in Traxxx.

- If the plugin receives a studio name that already has the same suffix as in the args, it will only try to search and return the data for that type indicated by the suffix.

- The plugin supports being piped data. This means, if you have a studio plugin `A` that runs before this plugin `B`, you can make this plugin NOT overwrite properties that plugin `A` already returned values for.  
**WARNING**: this is not the same as values that already exist for the studio. Example: you manually entered a description in the web UI and then run the plugin. If the plugin finds a channel/network with a description, that will become the new one.


### Arguments

| Name                      | Type     | Required | Description                                                                                                                                                               |
| ------------------------- | -------- | -------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| dry                       | Boolean  | false    | Whether to commit data changes                                                                                                                                            |
| studios                   | Object   | false    | Configuration for studio events                                                                                                                                           |
| studios.channelPriority   | Boolean  | false    | When the studio type is unknown, and the name corresponds to both a channel & a network, whether to prefer the channel or the network                                     |
| studios.uniqueNames       | Boolean  | false    | When the studio name corresponds to both a channel & a network, whether to append suffixes to the name to avoid conflicts                                                 |
| studios.channelSuffix     | String   | false    | When returning a channel name that also corresponds to a network, will be appended to the name. WARNING: spaces between the name & suffix will not be automatically added |
| studios.networkSuffix     | String   | false    | When returning a network name that also corresponds to a channel, will be appended to the name. WARNING: spaces between the name & suffix will not be automatically added |
| studios.whitelist         | String[] | false    | Array of data fields to pick (possible values: `'name', 'description', 'thumbnail', 'aliases', 'parent'`)                                                                 |
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
