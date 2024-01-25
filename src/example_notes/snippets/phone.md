# Phone

```yaml nunja-template
type: snippet

title: telephone
alias: 
- mobile phone
- smartphone

fields:
- title: Number
  type: text
  preset: '+49 '
  key: number

javascript: |
  context.text = context.number;
  context.number = context.number.replaceAll("+","00").replaceAll(" ", "");

template: |
  [{{text}}](tel:{{number}})
```
