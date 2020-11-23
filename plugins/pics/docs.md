## Plugin Details

This plugin retrieves pictures for actors, scenes, movies or studios

- You can configure an array of search configurations for every type.
- Each search configuration allows for searching for a single type of image.
- You may have multiple configurations of the same `'prop'`, to act as fallbacks if the previous configuration for that type had no results.
- - Only the last image found for a given `'prop'` will be created.
- - For an `'extra'` prop, if `getAllExtra` is enabled, all extra images found across all search search configurations will be created.

> Note: the example only shows a single search configuration for every type of item, but you can add as little or as many as you want

Example with multiple configurations & fallback:

```javascript
---
{
  "plugins": {
    "register": {
      "pics": {
        "path": "./plugins/pics/main.ts",
        "args": {
          "dry": false,
          "actors": [
            {
              "prop": "thumbnail",
              "path": "./path/to/low/resolution/actor/pictures",
              "searchTerm": "thumbnail",
            },
            {
              "prop": "thumbnail",
              "path": "./path/to/high/resolution/actor/pictures",
              "searchTerm": "thumbnail",
            },
            {
              "prop": "hero",
              "path": "./path/to/all/hero/pictures",
              "searchTerm": "thumbnail",
            },
            {
              "prop": "extra",
              "path": "./path/to/all/extra/pictures",
              "blacklistTerms": ["thumbnail", "hero", "avatar"],
              "getAllExtra": true
            }
          ]
        }
      }
    }
  }
}
---
```
