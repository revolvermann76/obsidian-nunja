# person

```yaml nunja-template
# a nunja template-type can be `note` or `snippet`
# if no type is given, `snippet` is the default
type: note  

# you can set the title for the template
# if no title is given, the filename is used as the title
# when there are more than one template in a file, 
# a title is mandatory
title: person
fields:
- title: Fellow
  type: boolean
  key: fellow

javascript: |
  context.fellow = !!context.fellow;

# the nunjucks template
template: |
  ---
  created: "{{date()}} {{time()}}"
  title: "{{title()}}"
  name: "{{title()}}"
  type: "[[person]]"
  fellow: {{fellow}}
  gender: 
  street: 
  town: 
  country: 
  zip: 
  phone: 
  mobile-phone: 
  email: 
  birthday: 
  birthplace: 
  deathday: 
  deathplace: 
  maiden-name: 
  parents: []
  children: []
  partner: 
  siblings: []
  
  ---
  # {{title()}}👤

  %% picture %%

  {{cursor}}
```
