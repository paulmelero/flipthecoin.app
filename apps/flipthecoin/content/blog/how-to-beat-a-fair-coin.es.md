---
title: 'Cómo ganarle a una moneda justa'
slug: como-ganarle-a-una-moneda-justa
series: patterns-in-the-noise
seriesOrder: 1
_locale: es
description: 'Tú y una amiga elegís cada uno un patrón de tres lanzamientos. La moneda es perfectamente justa. Y, aun así, quien elige segundo gana casi siempre. Esto es el juego de Penney: lo más extraño que puede hacer una moneda justa.'
published: true
level: intermediate
date: 2026-09-24T10:00:00Z
tags:
  - juego de Penney
  - no transitivo
  - patrones en carrera
  - coincidencia de patrones
  - moneda justa
  - tiempo de espera
  - paradoja
  - probabilidad
  - teoría de juegos
  - aleatoriedad
---

# Cómo ganarle a una moneda justa

_Tú y una amiga elegís cada una un patrón de tres lanzamientos. La moneda es perfectamente justa. Y, aun así, una de vosotras gana siete veces de cada ocho — y si eliges segundo, ese eres siempre tú._

Pídele a una amiga que nombre cualquier patrón de tres lanzamientos — por ejemplo, cara-cara-cara. Ahora nombra tú el tuyo. Después lanza una moneda justa una y otra vez, anotando cada resultado, hasta que uno de los dos patrones aparezca en la secuencia. Quien vea su patrón primero, gana.

Tu amiga eligió primero, así que tenía todo el universo de patrones a su disposición. La moneda es justa. Cada lanzamiento es independiente. No hay ningún truco _en el metal_. Y, aun así, el juego no es en absoluto un cara o cruz: sea lo que sea lo que elija tu amiga, existe un patrón que puedes elegir para vencerlo. No por poco. Contra su orgulloso _CCC_, tú eliges _XCC_ y ganas **siete veces de cada ocho**.

Esto es el :term[juego de Penney]{slug='juego-de-penney'}, y es el ejemplo más limpio que conozco de un proceso justo que produce un juego profundamente injusto. En el camino conoceremos un patrón que gana carreras que debería perder, y acabaremos en un lugar menos cómodo: preguntándonos qué significa realmente "justo" cuando la moneda no tiene preferencias — y nosotros sí.

<!--more-->

## ¿Quién fue Walter Penney?

Walter Francis Penney (1913–2000) fue un matemático y criptoanalista estadounidense. Pasó su carrera en la inteligencia de señales: primero en el grupo de descifrado de la Armada de Estados Unidos, y después durante 34 años en la Agencia de Seguridad Nacional (NSA), donde llegó a ser jefe de división.

Ese contexto no es una nota al pie. Un criptoanalista se pasa la vida mirando largas cadenas de símbolos y haciéndose una pregunta muy concreta: _¿qué patrón aparece primero, y dónde se solapa con otro?_ Encontrar estructura repetida en lo que debería parecer aleatorio era todo su trabajo. No sorprende, pues, que Penney, fuera del horario laboral, inventara un juego sobre exactamente eso.

Lo planteó como un pasatiempo — «Problema 95: Penney-Ante» — en el _Journal of Recreational Mathematics_ en octubre de 1969. También era famoso entre los aficionados a los acertijos por su serie «Problema del mes», que se publicó de 1966 a 1974. El juego le sobrevivió; la pregunta que plantea sigue siendo una de las más agudas de la probabilidad.

## La apuesta

Estas son las reglas, que caben en una tarjeta:

1. Dos jugadores eligen cada uno un patrón de caras y cruces — usaremos patrones de longitud tres.
2. Se lanza una moneda justa repetidamente.
3. Gana el primer jugador cuyo patrón aparezca _como una racha consecutiva_ en la secuencia.

Dos cosas hacen que esto sea distinto de un simple cara o cruz.

Primero, los patrones **se solapan**. Si la secuencia es _C C C X_, entonces _CCC_ aparece en las posiciones 1–3 y _CCX_ aparece en las posiciones 2–4. Un mismo tramo de lanzamientos puede contener varios patrones, y la carrera la decide el que se _complete primero_.

Segundo — y esta es toda la historia — **el orden en que elegís importa**. En un cara o cruz normal el pasado es irrelevante. Aquí el pasado _es_ el juego, porque un patrón es una afirmación sobre el **orden** de las cosas, no solo sobre sus recuentos.

## La tabla de los rencores

Tu oponente elige un patrón primero; tú eliges segundo. La tabla te da tu mejor elección y tu probabilidad de ganar (Penney 1969; Gardner 1988):

::penney-graph
---
caption: 'Figura 1: Relación entre los ocho patrones. Cada flecha apunta de un patrón a un patrón al que vence.'
coinSymbolHead: 'C'
coinSymbolTail: 'X'
---
| El oponente elige | **Tú eliges** | Tu probabilidad de ganar |
| ----------------- | ------------- | ------------------------ |
| CCC               | **XCC**       | 7/8                      |
| CCX               | **XCC**       | 3/4                      |
| CXC               | **CCX**       | 2/3                      |
| CXX               | **CCX**       | 2/3                      |
| XCC               | **XXC**       | 2/3                      |
| XCX               | **XXC**       | 2/3                      |
| XXC               | **CXX**       | 3/4                      |
| XXX               | **CXX**       | 7/8                      |
::

Fíjate en la forma. Nunca ganas menos de dos tercios de las veces. Contra los dos patrones extremos, _CCC_ y _XXX_, ganas siete veces de cada ocho.

Y no hay ningún patrón "mejor". A cada patrón lo vence otro, y las relaciones forman un bucle: a _CCC_ lo aplasta _XCC_; a _XCC_ lo vence _XXC_; _XXC_ cae ante _CXX_; _CXX_ pierde contra _CCX_ — al que, a su vez, vence _CCC_. Es **piedra, papel o tijera jugado con monedas**.

> La justicia a nivel de cada lanzamiento no protege de nada: los patrones predecibles de rachas consecutivas pueden vencerla igualmente.

::try-this
---
title: 'Pruébalo tú mism@.'
---
Lanza unas cuantas monedas en la [página de juego](/play/) y observa los patrones. Después juega la apuesta con una amiga: que elija primero un patrón de tres lanzamientos y usa la tabla de arriba para elegir el tuyo. Ganarás muchas más veces de las que perderás — con una moneda que no está haciendo absolutamente nada mal.
::

## Por qué ocurre

Cuando eliges _XCC_ contra el _CCC_ de tu oponente, no estás apostando por la moneda. Estás apostando por la **transición**.

El momento peligroso para tu oponente es cuando la secuencia es _C C_ — a un lanzamiento de su _CCC_. Pero esas mismas _CC_ son el _segundo y tercer_ símbolo de tu _XCC_. Si el siguiente lanzamiento es cruz, tu patrón simplemente vuelve a empezar. Tu patrón es _frágil de una forma útil_: puede solaparse consigo mismo, así que un intento fallido no siempre te devuelve a cero.

_CCC_ es lo contrario. Para completarlo necesitas tres caras seguidas, y cualquier cruz borra todo el progreso. _XCC_ puede recuperarse de una cruz; _CCC_ no. El patrón que parecía _más fuerte_ — tres iguales, la elección más audaz — es en realidad el más quebradizo.

Hay una forma clara de decirlo. Cada patrón tiene una **estructura de autosolapamiento**: cuánto de su propio final puede servir como su propio principio. _CCC_ se solapa consigo mismo por completo (sus dos últimos símbolos son sus dos primeros), lo que hace que sus apariciones lleguen en ráfagas cerradas, de todo o nada. _XCC_ se solapa menos y se puede alcanzar por más caminos.

## Los números conductores de Conway

Las probabilidades exactas de victoria provienen de un método inventado por **John Horton Conway** (1937–2020), el matemático británico detrás del Juego de la Vida, los números surreales y _Winning Ways_. El truco de Conway consiste en deslizar un patrón a lo largo del otro y, en cada desplazamiento en el que el final de uno coincide con el principio del otro, anotar un peso que es una potencia de dos. Sumar esos pesos da dos números para cualquier par de patrones; comparar el solapamiento de un patrón consigo mismo con su solapamiento con el oponente da las probabilidades exactas.

No vamos a deducir la fórmula aquí, pero es corta: si los dos patrones son $A$ y $B$, las probabilidades de que $A$ venza a $B$ son $(BB - BA) : (AA - AB)$, donde cada término de dos letras es una puntuación de solapamiento ponderada. Los números de la tabla anterior no son estimaciones ni simulaciones. Son exactos: unas pocas líneas de aritmética que sustituyen a una infinidad de lanzamientos.

## La espera que miente

Ahora se pone más raro. Hay varias preguntas distintas que puedes hacerle a un patrón, y una moneda justa las responde de forma diferente:

1. **¿Cuánto tarda este patrón en aparecer por sí solo?** Esta es la :term[espera esperada]{slug='espera-esperada'}, escrita $W$.
2. **Si este patrón y otro compiten, ¿cuál es más probable que aparezca primero?**

Tu instinto dice que el patrón que llega antes debería ganar la carrera. A menudo es así. Pero no siempre.

¿Cómo se calcula la espera esperada? Cada patrón lleva su propio autosolapamiento. Suma $2^r$ por cada $r$ tal que los últimos $r$ símbolos del patrón sean iguales a sus primeros $r$ símbolos:

$$W(S)=\sum_{r:\,\text{sufijo}_r=\text{prefijo}_r} 2^r$$

Para _CCC_ los solapamientos son $r=1,2,3$, así que $W(CCC)=2+4+8=14$. Para _XCC_ solo coincide $r=3$, así que $W(XCC)=2^3=8$. Cuanto más se solapa un patrón consigo mismo, más tiende a tardar en aparecer.

Así que _CCC_ tarda casi el doble que _XCC_, y pierde la carrera: esa parte es intuitiva. Ahora mira un par en el que el instinto se rompe:

| Par de patrones  | Espera esperada              | Probabilidad de que gane el primero    |
| ---------------- | ---------------------------- | -------------------------------------- |
| _XCXC_ vs _CXCC_ | $W(XCXC)=20$ vs $W(CXCC)=18$ | $P(\text{XCXC antes que CXCC}) = 9/14$ |
| _XXCC_ vs _CCC_  | $W(XXCC)=16$ vs $W(CCC)=14$  | $P(\text{XXCC antes que CCC}) = 7/12$  |
| _XCCC_ vs _CCC_  | $W(XCCC)=16$ vs $W(CCC)=14$  | $P(\text{XCCC antes que CCC}) = 7/8$   |

Lee con atención la segunda y la tercera fila. _CCC_ es el patrón **más rápido** en ambas — espera esperada 14, menor que 16 — y **pierde la carrera** en las dos. Contra _XCCC_ pierde siete veces de cada ocho. Contra _XXCC_ pierde más de la mitad de las veces.

> "Llega antes de media" y "gana la carrera" son preguntas distintas. Una moneda justa las responde de forma distinta.

Esta es la **paradoja del tiempo de espera**. Parece una contradicción hasta que ves por qué las preguntas se separan. Una espera esperada promedia sobre miles de ejecuciones separadas e independientes. Una carrera es una única secuencia compartida, en la que la llegada de un patrón puede bloquear al otro antes de que siquiera empiece. La media es un hecho sobre muchos mundos; la carrera es un hecho sobre uno. Es fácil confundirlos.

Esta paradoja tiene un tratamiento formal precioso en [Frym (2023), _The Waiting-Time Paradox_](https://www.math.ucla.edu/~mason/papers/frym-WTP-published.pdf), por si quieres la versión completa.

## La misma moneda, en todas partes

El bucle que encontramos no es un truco de monedas. Es una estructura general llamada :term[no transitividad]{slug='no-transitivo'}: un juego sin mejor jugada, solo una mejor jugada _contra algo_. Una vez que la ves, la encuentras en todas partes:

- **Piedra, papel o tijera** es el ejemplo más puro: ningún gesto vence a los otros dos, pero cada gesto vence a uno y pierde contra otro.
- **Los dados no transitivos** existen de la misma forma: conjuntos de dados en los que cada dado es más probable que venza al siguiente, dando vueltas y vueltas.
- **Los ciclos de Condorcet** en las votaciones: con tres candidatos, una mayoría puede preferir A a B, B a C y C a A. Ningún candidato vence a todos los demás, así que no hay una "voluntad del pueblo" que leer — solo el orden en que preguntas.
- **El Juego de la Vida de Conway**, el autómata celular que Conway también inventó, es un primo en espíritu más que un ciclo: un puñado de reglas locales sencillas, aplicadas una y otra vez, producen un comportamiento que nadie puede predecir de antemano. Reglas simples, consecuencias infinitas: la misma lección que la moneda no deja de enseñarnos.

Y luego está la biología. En un llamativo experimento de 2020, unos investigadores diseñaron tres cepas de _E. coli_ que se matan entre sí en un bucle: la Roja mata a la Verde, la Verde mata a la Azul y la Azul mata a la Roja. Pero las matanzas no son igual de fuertes: la toxina de la Roja es, con diferencia, la más letal. Cabría esperar que la Roja, la más fuerte, se hiciera con la placa. Nunca ocurre. La Roja mata a su víctima tan rápido que pronto se enfrenta al único enemigo que no puede vencer, mientras la cepa más suave, ignorada porque no es una amenaza inmediata para nadie, sobrevive, se extiende y acaba heredándolo todo. Los autores lo llamaron [**supervivencia del más débil**](https://www.nature.com/articles/s41467-020-19963-8). En un mundo no transitivo, la mejor arma es una carga.

En cada uno de estos ejemplos, ninguna opción individual tiene nada de malo. El ciclo aparece solo cuando las comparas de dos en dos.

## No hay ningún patrón más fuerte

Penney se pasó la vida leyendo secuencias que alguien más intentaba mantener en secreto. No es difícil ver por qué un juego sobre qué patrón aparece primero le resultaría atractivo: en criptoanálisis la respuesta nunca depende solo de los símbolos. Depende de cómo se solapa una cadena con otra, de dónde empieza y de qué vino justo antes.

Lo que dejó es más que un truco de salón. Es una demostración pequeña y perfecta de una idea grande: si no existe una estrategia que venza a todas las demás, entonces "la mejor" no es una propiedad que una estrategia tenga por sí sola. Es una propiedad de la **relación** entre dos jugadores. La fuerza es relacional. Un patrón es fuerte solo por el patrón al que se enfrenta; cambia el oponente y el mismo patrón se vuelve el perdedor.

Por eso la paradoja del tiempo de espera y el experimento con _E. coli_ son la misma historia. En un mundo cíclico, ser el más fuerte no es una posición segura: es la posición que tiene un depredador. La cepa más letal es la que se compromete en exceso y se expone. La "más débil" gana porque no es el objetivo de nadie hasta que ya es demasiado tarde. Y el Juego de la Vida, que Conway construyó con reglas aún más simples que un lanzamiento de moneda, recuerda que la complejidad y la sorpresa pueden surgir de casi nada — sin ganador, sin plan, solo el siguiente paso siguiendo al anterior.

La no transitividad es también la forma de la mayoría de los desacuerdos reales. Cuando A vence a B, B vence a C y C vence a A, ninguna clasificación cuidadosa producirá un orden estable — no porque los jugadores sean irracionales, sino porque la propia relación contiene un ciclo. Kenneth Arrow demostró que cualquier sistema de votación con unas pocas propiedades razonables producirá a veces exactamente este bucle. El fallo no está en los votantes. Está en la exigencia de un único ganador.

Así que quizá el uso más antiguo de la moneda — producir un ganador, limpiamente y sin discusión — lleva tiempo diciéndonos lo contrario de lo que suponíamos. Una moneda justa puede zanjar una carrera entre dos cosas. No puede decirte cuál de tres cosas es la mejor, porque "mejor" puede que no exista. Lo que existe es el ciclo, y cada posición en él es la fuerza de alguien y la debilidad de otro.

Nos pasamos mucho tiempo buscando el mejor patrón que jugar. La moneda sugiere una pregunta más honesta: no _¿cuál es la mejor jugada?_, sino _¿es este el momento adecuado, y es este el rival adecuado?_ En un mundo de ciclos, ganar tiene menos que ver con ser el más fuerte y más con estar en el lugar correcto en el momento correcto.

## Ver también

:term[Ensayo de Bernoulli]{slug='ensayo-de-bernoulli'} · :term[Distribución binomial]{slug='distribucion-binomial'} · :term[La falacia del jugador]{slug='falacia-del-jugador'} · :term[Paseo aleatorio]{slug='paseo-aleatorio'} · :term[Distribución geométrica]{slug='distribucion-geometrica'}

## Referencias

- Penney, W. «Problem 95. Penney-Ante». _Journal of Recreational Mathematics_ 2, 241, 1969. Resumen: [juego de Penney](https://es.wikipedia.org/wiki/Juego_de_Penney).
- Honsberger, R. «Some Surprises in Probability». En _Mathematical Plums_. MAA, 1979, pp. 100–103.
- Gardner, M. «Nontransitive Paradoxes». En _Time Travel and Other Mathematical Bewilderments_. W. H. Freeman, 1988, pp. 64–66.
- Berlekamp, E. R.; Conway, J. H.; y Guy, R. K. _Winning Ways for Your Mathematical Plays, Vol. 1_, 2.ª ed. A K Peters, 2001.
- Guibas, L. J. y Odlyzko, A. M. «String Overlaps, Pattern Matching, and Nontransitive Games». _Journal of Combinatorial Theory, Series A_ 30(2), 1981, pp. 183–208.
- Lynn, B. «Penney's Game». [theory.stanford.edu/~blynn/pr/penney.html](https://theory.stanford.edu/~blynn/pr/penney.html) — la deducción con funciones generadoras detrás del algoritmo de Conway.
- Frym, N. «The Waiting-Time Paradox». [PDF](https://www.math.ucla.edu/~mason/papers/frym-WTP-published.pdf).
- Liao, M. J. et al. «Survival of the Weakest in Non-transitive Asymmetric Interactions among Strains of _E. coli_». _Nature Communications_ 11, 6055, 2020. [nature.com/articles/s41467-020-19963-8](https://www.nature.com/articles/s41467-020-19963-8)
- Walter Penney (1913–2000): [obituario](https://www.washingtonpost.com/archive/local/2000/06/26/walter-penney-cryptographer-dies-at-87/09b7cefc-fc18-4339-8757-304bd5814704/) · [biografía (FR)](https://fr.wikipedia.org/wiki/Walter_Penney)
- Weisstein, E. W. «Coin Tossing». [MathWorld](https://mathworld.wolfram.com/CoinTossing.html).
  ::
