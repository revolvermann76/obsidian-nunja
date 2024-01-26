# Dataview

```yaml nunja-template
# a nunja template-type can be `note` or `snippet`
# if no type is given, `snippet` is the default
type: snippet  

# you can set the title for the template
# if no title is given, the filename is used as 
# the title. when there are more than one template 
# in a file, a title is mandatory
title: table

fields:
- title: How many rows?
  type: text
  preset: ''
  default: 2
  key: columns

javascript: |
  let columns = parseInt(context.columns) || 2;

  let content ="";
  let first = "";
  let second = "";
  let third = "";

  for(let i = 0; i < columns; i++){
    first += i===0 ? "       " :"|        ";
    second+= "| ------ ";
    third += "|        ";
  } 

  first += "|\n";
  second += "|\n";
  third += "|\n";

  context.table = first + second + third;

# the nunjucks template
template: |
  | {{cursor}}{{table}}
```