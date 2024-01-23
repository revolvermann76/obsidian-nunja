# Mermaid diagrams

```yaml nunja-template
# a nunja template-type can be `note` or `snippet`
# if no type is given, `snippet` is the default
type: snippet  

# you can set the title for the template
# if no title is given, the filename is used as 
# the title. when there are more than one template 
# in a file, a title is mandatory
title: mermaid class diagram

# the nunjucks template
template: |
  ```mermaid
  classDiagram
    note "From Duck till Zebra"
    Animal <|-- Duck
    note for Duck "can fly
  can swim
  can dive
  can help in debugging"
    Animal <|-- Fish
    Animal <|-- Zebra
    Animal : +int age
    Animal : +String gender
    Animal: +isMammal()
    Animal: +mate()
    class Duck{
      +String beakColor
      +swim()
      +quack()
    }
    class Fish{
      -int sizeInFeet
      -canEat()
    }
    class Zebra{
      +bool is_wild
      +run()
    }
    ```
```

```yaml nunja-template
type: snippet  
title: mermaid gantt diagram
template: |
  ```mermaid
  gantt
    title A Gantt Diagram
    dateFormat  YYYY-MM-DD
    section Section
    A task           :a1, 2022-01-01, 30d
    Another task     :after a1  , 20d
    section Another
    Task in sec      :2022-01-12  , 12d
    another task      : 24d
  ```
```

```yaml nunja-template
type: snippet  
title: mermaid graph diagram
template: |
  ```mermaid
  graph TD;  
    A-->B;  
    A-->C;  
    B-->D;  
    C-->D;  
  ```
```

```yaml nunja-template
type: snippet  
title: mermaid mind map
template: |
  ```mermaid
  %%{init: {'theme':'neutral'}}%%
  mindmap
  root((Tarek))
    Origins
    Long history
    ::icon(fa fa-book)
    Shapes
      id[I am a square]
      id(I am a rounded square)
      id)I am a cloud(
      id{{I am a hexagon}}
      id))I am a bang((
      id((I am a circle))
    Research
    On effectiveness<br/>and features
    On Automatic creation
      Uses
        Creative techniques
        Strategic planning
        Argument mapping
    Tools
    Pen and paper
    Mermaid 
  ```
```

```yaml nunja-template
type: snippet  
title: mermaid pie chart
template: |
  ```mermaid
  pie
    title 
    "Subject1" : 20
    "Subject2" : 50 
  ```
```

```yaml nunja-template
type: snippet  
title: mermaid xy chart
template: |
  ```mermaid
  %%{init: {'theme':'dark'}}%%
  xychart-beta
    title "Sales Revenue"
    x-axis [jan, feb, mar, apr, may, jun, jul, aug, sep, oct, nov, dec]
    y-axis "Revenue (in $)" 4000 --> 11000
    bar [5000, 6000, 7500, 8200, 9500, 10500, 11000, 10200, 9200, 8500, 7000, 6000]
  ```
```