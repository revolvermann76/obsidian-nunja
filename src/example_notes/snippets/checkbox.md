# Checkbox

```yaml nunja-template
# a nunja template-type can be `note` or `snippet`
# if no type is given, `snippet` is the default
type: snippet  

# you can set the title for the template
# if no title is given, the filename is used as 
# the title. when there are more than one template 
# in a file, a title is mandatory
title: checkbox

# the template will show some input-fields to gather more info for the template
# there are four types of fields "text", "area", "boolean" and "choice"
fields:
- title: Checked
  type: boolean
  preset: false
  key: checked
  
javascript: |
  context.checked = context.checked ? "x" : " ";

# the nunjucks template
template: |
  - [{{checked}}] {{selection}}{{cursor}}
```
