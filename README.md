# lowclass

JavaScript/TypeScript class inheritance tools.

#### `npm install lowclass`

# Features

Lowclass is a lib that includes the following inheritance tools:

- A `multiple()` function for composing JavaScript `class`es together in a simple
  ergonomic way as a simpler alternative to mixing functions. For example:

  ```js
  // define a few classes with unique features:
  class Walker {
  	walk() {
  		/* feet move */
  	}
  }
  class Talker {
  	talk() {
  		/* hello */
  	}
  }
  class Barker {
  	bark() {
  		/* woof */
  	}
  }
  class Attacker {
  	attack() {
  		/* boom */
  	}
  }

  // Now use them like regular classes by extending from them normally:

  class StarWarsATATWalker extends Walker {
  	fireLaser() {
  		/* ... */
  	}
  }

  const atat = new StarWarsATATWalker()
  atat.walk()
  atat.fireLaser()

  // Or compose them together:

  class Dog extends multiple(Walker, Barker, Attacker) {
  	lick() {
  		/* ... */
  	}
  }

  const dog = new Dog()
  dog.lick()
  dog.walk()
  dog.bark()
  dog.attack()

  class Human extends multiple(Talker, Attacker, Walker) {
  	yell() {
  		/* Hey! */
  	}
  }

  const person = new Human()
  person.yell()
  person.walk()
  person.talk()
  person.attack()
  ```

- A `Mixin()` function for creating mixable JavaScript `class`es as an alternative
  to `multiple()`. Mixins are less ergonomic than composing classes with the
  `multiple()` helper, but if you're after the most performance, then mixins (made
  with or without the `Mixin()` helper) will have faster instantiation and
  property lookup than classes composed with `multiple()` because `multiple()`
  uses `Proxy` under the hood. In most cases, the performance difference matters
  not, and using `multiple()` leads to cleaner and simpler code.

  The following example implements the same thing as the above example with
  `multiple()`, and we can see it is more verbose:

  ```js
  import {Mixin} from 'lowclass'

  // define a few "class-factory mixins":
  const Walker = Mixin(Base => {
  	return class Walker extends Base {
  		walk() {
  			/* feet move */
  		}
  	}
  })
  const Talker = Mixin(Base => {
  	return class Talker extends Base {
  		talk() {
  			/* hello */
  		}
  	}
  })
  const Barker = Mixin(Base => {
  	return class extends Base {
  		bark() {
  			/* woof */
  		}
  	}
  })
  const Attacker = Mixin(Base => {
  	return class extends Base {
  		attack() {
  			/* boom */
  		}
  	}
  })

  // At this point Walker, Talker, and Barker are references to `class`es.

  // Now use them like regular classes by extending from them normally:

  class StarWarsATATWalker extends Walker {
  	fireLaser() {
  		/* ... */
  	}
  }

  const atat = new StarWarsATATWalker()
  atat.walk()
  atat.fireLaser()

  // Or mix them together to compose features together:

  class Dog extends Walker.mixin(Barker.mixin(Attacker)) {
  	lick() {
  		/* ... */
  	}
  }

  const dog = new Dog()
  dog.lick()
  dog.walk()
  dog.bark()
  dog.attack()

  class Human extends Talker.mixin(Attacker.mixin(Walker)) {
  	yell() {
  		/* Hey! */
  	}
  }

  const person = new Human()
  person.yell()
  person.walk()
  person.talk()
  person.attack()
  ```
