# song

```yaml nunja-template
# a nunja template-type can be `note` or `snippet`
# if no type is given, `snippet` is the default
type: note  

# you can set the title for the template
# if no title is given, the filename is used as the title
# when there are more than one template in a file, 
# a title is mandatory
title: song

fields:
- title: Artist
  type: text
  key: artist
- title: Album
  type: text
  key: album
- title: Year
  type: text
  key: year
- title: composer
  type: text
  key: composer

# the nunjucks template
template: |
  ---
  created: "{{date()}} {{time()}}"
  title: "{{title()}}"
  type: "[[song]]"
  title: "{{title()}}"
  artist: "{{artist}}"
  ---
  # {{title()}} 🎶

  artist:: {{artist}}
  composer:: {{composer}}
  album:: {{album}}
  year:: {{year}}

  ## Lyrics

  {{cursor}}

```
