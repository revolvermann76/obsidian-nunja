# Dataview

```yaml nunja-template
# a nunja template-type can be `note` or `snippet`
# if no type is given, `snippet` is the default
type: snippet  

# you can set the title for the template
# if no title is given, the filename is used as 
# the title. when there are more than one template 
# in a file, a title is mandatory
title: dataview list referencing notes

# the nunjucks template
template: |
  ```dataview
  LIST FROM [[#]] AND !"tpl" AND !#category AND !#diary WHERE file.name != this.file.name SORT file.name ASC
  ```
```