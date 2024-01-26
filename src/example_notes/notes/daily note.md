# daily note

```yaml nunja-template
# a nunja template-type can be `note` or `snippet`
# if no type is given, `snippet` is the default
type: note  

# you can set the title for the template
# if no title is given, the filename is used as the title
# when there are more than one template in a file, 
# a title is mandatory
title: daily note

open: true

javascript: |
  const today = new Date();
  const year = today.getFullYear();
  const month = ("0" + (today.getMonth() + 1)).slice(-2);
  const day = ("0" + today.getDate()).slice(-2);
  context["heading"] = `${year}-${month}-${day}`;

# the nunjucks template
template: |
  ---
  created: {{date()}} {{time()}}
  title: {{heading}}
  date: {{dateStamp}}
  tags: 
  - diary
  ---
  # {{heading}}

  {{cursor}}

```
