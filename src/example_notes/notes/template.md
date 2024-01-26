# template

```yaml nunja-template
# a nunja template-type can be `note` or `snippet`
# if no type is given, `snippet` is the default
type: note  

# you can set the title for the template
# if no title is given, the filename is used as the title
# when there are more than one template in a file, 
# a title is mandatory
title: template

destination: $$templateFolder$$

fields:
- title: Template type
  type: choice
  preset: ""
  key: tplType
  items: 
    snippet: snippet
    note: note

# the nunjucks template
template: |
  ```yaml nunja-template
  # a nunja template-type can be `note` or `snippet`
  # if no type is given, `snippet` is the default
  type: {{tplType}}

  # you can set the title for the template
  # if no title is given, the filename is used as the title
  # when there are more than one template in a file, 
  # a title is mandatory
  title: {{title()}}

  # uncomment the next line to set a output directory
  # destination: somewhere/in/your/vault

  fields:
  - title: Lorem ipsum
    type: text
    preset: ""
    key: lorem
    items: 
      Lirum: lirum
      Larum: larum
  
  javascript: |
    context.xyz = Math.random()
    // write some more javascript ...

  template: |
    {% raw %}# {{title()}}
    Here is the Javascript variable: "{{xyz}}"
    Here is the result from your field: "{{lorem}}"{% endraw %}
  ```
```
