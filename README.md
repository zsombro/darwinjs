# darwin.js
darwin.js is a small library written in JavaScript to aid the creation of simple genetic algorithms in the browser.
It doesn't do any fancy stuff, but what it does can be done pretty quickly and simply. It's not really meant to be a robust
soft computing library, instead it's a simple tool for educational and prototyping purposes. 

## It's actually pretty easy to use
It's not exactly rocket science to get started with ```darwin.js```. To create a population of objects, just import the library
on an HTML page and add something similar to this piece of code:

```javascript
var p = new darwin.Population(100, 0.5); // a population of 100 entities with a target fitness of 0.5
p.populate(Entity);
```

In this example code, ```Entity``` is going to be the constructor of an object that has implemented the following operations:
- calculation of fitness ```Entity.fitness();```
- crossover with another entity ```Entity.crossover(b);```
- mutation ```Entity.mutate();```

When these prerequisites are met, you can freely run a selection algorithm. ```darwin.js``` performs a roulette wheel
selection by default. When that is done, you can create the next generation of entites by performing a crossover.

```javascript
p.selection();
p.crossover();
```

That's basically it.

###Things I'd like to add in the future
- More selection methods. Right now, only the roulette wheel selection can be performed.
- An easy way to visualize data (think stuff like graphs), preferably on a 2d canvas.
