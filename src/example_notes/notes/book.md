# book

```yaml nunja-template
# a nunja template-type can be `note` or `snippet`
# if no type is given, `snippet` is the default
type: note  

# you can set the title for the template
# if no title is given, the filename is used as the title
# when there are more than one template in a file, 
# a title is mandatory
title: book
fields:
- title: Author
  type: text
  key: author

javascript: |
  function removeLastOccurrence(str, searchStr) {
    var lastIndex = str.lastIndexOf(searchStr);
    if (lastIndex === -1) {
      return str;
    }
    return str.substring(0, lastIndex) + str.substring(lastIndex + searchStr.length);
  }

  const cleanedPath = context.path.replace(context.filename, "");
  const filename = removeLastOccurrence(context.filename, ".md");
  context.filename = filename + " (band).md";
  context.path = cleanedPath + context.filename;

# the nunjucks template
template: |
  ---
  created: {{date()}} {{time()}}
  title: {{title()}}
  type: "[[book]]"
  author:"{{author}}": 
  year: 
  publisher: 
  place: 
  edition: 
  ISBN: 
  ---
  # {{title()}}📖

  author:: {{author}}

  %% Picture %%
  ## Summary

  {{cursor}}

  ## Impressions
```
