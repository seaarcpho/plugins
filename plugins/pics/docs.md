## Plugin Details

This plugin retrieves pictures for actors, scenes, movies or studios

- You can configure an array of search configurations for every type.
- Each search configuration allows for searching for a single type of image.
- For every search configuration, the name of the current item the plugin is being run for will automatically be searched for. You may add extra terms to search for via `searchTerms`
- - 🚨 `WARNING`: make sure to add a search term for a configuration that searches in a folder that contains different types of images (hero, avatar...). Otherwise it may add an avatar image as a hero image or vice versa
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
              "searchTerms": ["thumbnail"]
            },
            {
              "prop": "thumbnail",
              "path": "./path/to/high/resolution/actor/pictures",
              "searchTerms": ["thumbnail"]
            },
            {
              "prop": "hero",
              "path": "./path/to/all/hero/pictures",
              "searchTerms": ["hero"]
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
