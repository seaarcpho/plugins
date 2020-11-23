## pics 2.0.0

by boi123212321, john4valor, leadwolf

Find actor, scene, movie, studio images based on local files. GIF support.

### Documentation

## Plugin Details

This plugin retrieves pictures for actors, scenes, movies or studios
- You can configure an array of search configurations for every type.
- Each search configuration allows for searching for a single type of image.
- You may have multiple configurations of the same `'prop'`, to act as fallbacks if the previous configuration for that type had no results.
- - Only the last image found for a given `'prop'` will be created.

> Note: the example configuration only shows a single configuration for every type of item, but you can add as little or as many as you want

### Arguments

| Name                   | Type                                                         | Required | Description                                                                                                                                                       |
| ---------------------- | ------------------------------------------------------------ | -------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| dry                    | Boolean                                                      | false    | Whether to commit data changes                                                                                                                                    |
| actors                 | Array                                                        | true     | Array of picture search configurations for actors                                                                                                                 |
| actors.[0]             | Object                                                       | true     | One configuration for a type of actor picture                                                                                                                     |
| actors.[0].prop        | `'thumbnail' | 'altThumbnail' | 'avatar' | 'hero' | 'extra'` | true     | The type of picture that should be attached to the actor. Set to `'extra'` to add any image you want to the gallery                                               |
| actors.[0].path        | string                                                       | true     | The path in which to search for this picture                                                                                                                      |
| actors.[0].searchTerm  | string                                                       | true     | The extra string that the picture path should contain. Does not need a value for when the prop is `'extra'`. Does not need a value for when the prop is `'extra'` |
| scenes                 | Array                                                        | true     | Array of picture search configurations for scenes                                                                                                                 |
| scenes.[0]             | Object                                                       | true     | One configuration for a type of scene picture                                                                                                                     |
| scenes.[0].prop        | `'thumbnail' | 'extra'`                                      | true     | The type of picture that should be attached to the scene. Set to `'extra'` to add any image you want to the gallery                                               |
| scenes.[0].path        | string                                                       | true     | The path in which to search for this picture                                                                                                                      |
| scenes.[0].searchTerm  | string                                                       | true     | The extra string that the picture path should contain. Does not need a value for when the prop is `'extra'`                                                       |
| movies                 | Array                                                        | true     | Array of picture search configurations for movies                                                                                                                 |
| movies.[0]             | Object                                                       | true     | One configuration for a type of movie picture                                                                                                                     |
| movies.[0].prop        | `'backCover' | 'frontCover' | 'spineCover' | 'extra'`        | true     | The type of picture that should be attached to the movie. Set to `'extra'` to add any image you want to the gallery                                               |
| movies.[0].path        | string                                                       | true     | The path in which to search for this picture                                                                                                                      |
| movies.[0].searchTerm  | string                                                       | true     | The extra string that the picture path should contain. Does not need a value for when the prop is `'extra'`                                                       |
| studios                | Array                                                        | true     | Array of picture search configurations for studios                                                                                                                |
| studios.[0]            | Object                                                       | true     | One configuration for a type of studio picture                                                                                                                    |
| studios.[0].prop       | `'thumbnail' | 'extra'`                                      | true     | The type of picture that should be attached to the studio. Set to `'extra'` to add any image you want to the gallery                                              |
| studios.[0].path       | string                                                       | true     | The path in which to search for this picture                                                                                                                      |
| studios.[0].searchTerm | string                                                       | true     | The extra string that the picture path should contain. Does not need a value for when the prop is `'extra'`                                                       |

### Example installation with default arguments

`config.json`
```json
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
              "path": "./path/to/all/actor/pictures",
              "searchTerm": "thumbnail"
            }
          ],
          "scenes": [
            {
              "prop": "thumbnail",
              "path": "./path/to/all/scene/pictures",
              "searchTerm": "thumbnail"
            }
          ],
          "movies": [
            {
              "prop": "thumbnail",
              "path": "./path/to/all/movie/pictures",
              "searchTerm": "thumbnail"
            }
          ],
          "studios": [
            {
              "prop": "thumbnail",
              "path": "./path/to/all/studio/pictures",
              "searchTerm": "thumbnail"
            }
          ]
        }
      }
    },
    "events": {
      "actorCreated": [
        "pics"
      ],
      "actorCustom": [
        "pics"
      ],
      "sceneCreated": [
        "pics"
      ],
      "sceneCustom": [
        "pics"
      ],
      "movieCreated": [
        "pics"
      ],
      "studioCreated": [
        "pics"
      ],
      "studioCustom": [
        "pics"
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
    pics:
      path: ./plugins/pics/main.ts
      args:
        dry: false
        actors:
          - prop: thumbnail
            path: ./path/to/all/actor/pictures
            searchTerm: thumbnail
        scenes:
          - prop: thumbnail
            path: ./path/to/all/scene/pictures
            searchTerm: thumbnail
        movies:
          - prop: thumbnail
            path: ./path/to/all/movie/pictures
            searchTerm: thumbnail
        studios:
          - prop: thumbnail
            path: ./path/to/all/studio/pictures
            searchTerm: thumbnail
  events:
    actorCreated:
      - pics
    actorCustom:
      - pics
    sceneCreated:
      - pics
    sceneCustom:
      - pics
    movieCreated:
      - pics
    studioCreated:
      - pics
    studioCustom:
      - pics

---
```
