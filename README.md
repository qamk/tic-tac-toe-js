# Tic Tac Toe
This project was a great introduction to some common JavaScript patterns: **factory function** and **module** patterns. Creating with these patterns felt pretty awesome and I recommend you familiarise yourself with them if you haven't already.

## Task
The task was to make a simple Tic Tac Toe game where 2 people can play against each other. The key thing was to limit use of the global namespace as much as possible (so completely contrasting my last project) and utilise the aforementioned patterns.

I also tried to use some other good design practises that I've read about but it's far from perfect: I still have a lot to learn about JS before I can understand how to effectively refactor.

- [x] Use Factory functions and modules
- [x] Allow users to enter a name
- [x] Game checks for row (column and diagonal) wins

## Resources
- Factory functions
  - https://www.javascripttutorial.net/javascript-factory-functions/
- Module pattern
  - https://coryrylan.com/blog/javascript-module-pattern-basics
- Removing a DOM element's children
  - https://stackoverflow.com/questions/3955229/remove-all-child-elements-of-a-dom-node-in-javascript
  - just calling `.remove()` did not work and using `.lastElementChild()` worked instead
- Immediately Invoked Function Expressions (IIFE)
  - http://adripofjavascript.com/blog/drips/an-introduction-to-iffes-immediately-invoked-function-expressions.html


## Discussion
There are additional things I can do to clean up output but I'd rather continue learning more about Frontend development. I may come back and clean up this project eventually but I believe that to be unlikely. Overall, a fantastic way to start using these patterns.