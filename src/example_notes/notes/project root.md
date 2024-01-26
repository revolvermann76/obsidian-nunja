# project root

```yaml nunja-template
# a nunja template-type can be `note` or `snippet`
# if no type is given, `snippet` is the default
type: note  

# you can set the title for the template
# if no title is given, the filename is used as the title
# when there are more than one template in a file, 
# a title is mandatory
title: project root

# the nunjucks template
template: |
  ---
  created: "{{date()}} {{time()}}"
  title: "{{title()}}"
  type: "[[project]]"
  project: "{{title()}}"
  project/categories:
  type: "[[project]]"
  ---
  # [[Project]]: {{title}} 

  #project/state/planned  

  ## Description

  {{cursor}}

  ```dataviewjs 
  const notes = dv.pages('[[#]] AND -#diary').sort(p=>p.file.name)
  if (notes.length) {
  	dv.el("h3","Related notes");
  	dv.list(notes.file.link);
  } 
  ```

  ## Key data

  - 

  ## Tasks

  ## Questions

  ## Miscellaneous

```
