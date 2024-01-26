# application

```yaml nunja-template
# a nunja template-type can be `note` or `snippet`
# if no type is given, `snippet` is the default
type: note  

# you can set the title for the template
# if no title is given, the filename is used as the title
# when there are more than one template in a file, 
# a title is mandatory
title: application

# the nunjucks template
template: |
  ---
  created: {{date()}} {{time()}}
  title: {{title()}}
  type: "[[application]]"
  ---
  # {{title()}}⚙️

  ## Purpose

  {{cursor}}

  ## Specs

  **vendor**:  
  **homepage**: 
  **operating system**: 
  **pricing**: 

  ## Miscellaneous

```
