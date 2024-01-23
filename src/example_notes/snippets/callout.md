# Callout

```yaml nunja-template
# a nunja template-type can be `note` or `snippet`
# if no type is given, `snippet` is the default
type: snippet  

# you can set the title for the template
# if no title is given, the filename is used as 
# the title. when there are more than one template 
# in a file, a title is mandatory
title: callout

# the template will show some input-fields to gather more info for the template
# there are four types of fields "text", "area", "boolean" and "choice"
fields:

- title: Type
  type: text
  preset: ''
  default: NOTE
  key: callout-type
  items: 
    Abstract: ABSTRACT
    Attention: ATTENTION
    Bug: BUG
    Caution: CAUTION
    Cite: CITE
    Danger: DANGER
    Error: ERROR
    Example: EXAMPLE
    Fail: FAIL
    Failure: FAILURE
    Faq: FAQ
    Info: INFO
    Missing: MISSING
    Note: NOTE
    Question: QUESTION
    Quote: QUOTE
    Success: SUCCESS
    Tip: TIP
    Todo: TODO
    Task: TODO
    Warning: WARNING

- title: Title
  type: text
  preset: ''
  key: callout-title
  
- title: Folding
  type: boolean
  preset: false
  key: folding
  
javascript: |
  context.folding = context.folding ? "-" : "";
  context["callout-type"] = context["callout-type"] || "NOTE";

# the nunjucks template
template: |
  > [!{{callout-type}}]{{folding}} {{callout-title}}
  > {{selection}}{{cursor}}
```
