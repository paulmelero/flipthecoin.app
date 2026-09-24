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

_Tú y una amiga elegís cada una un patrón de tres lanzamientos. La moneda es perfectamente justa. Y, aun así, una de vosotras gana siete veces de cada ocho — y si eliges segundo, esa eres siempre tú._ 🤔

Pídele a una amiga que nombre cualquier patrón de tres lanzamientos — por ejemplo, cara-cara-cara. Ahora nombra tú el tuyo. Después lanza una moneda justa una y otra vez, anotando cada resultado, hasta que uno de los dos patrones aparezca en la secuencia. Quien vea su patrón primero, gana.

Tu amiga eligió primero, así que tenía todo el universo de patrones a su disposición. La moneda es justa. Cada lanzamiento es independiente. No hay ningún truco _en el metal_. Y, aun así, el juego no es en absoluto un cara o cruz: sea lo que sea lo que elija tu amiga, existe un patrón que puedes elegir para vencerlo. No por poco. Contra su orgulloso _OOO_, tú eliges _XOO_ y ganas **siete veces de cada ocho**.

Esto es el **juego de Penney**, y es el ejemplo más limpio que conozco de un proceso justo que produce un juego profundamente injusto. En el camino conoceremos un patrón que gana carreras que debería perder, y acabaremos en un lugar menos cómodo: preguntándonos qué significa realmente "justo" cuando la moneda no tiene preferencias — y nosotr@s sí.

<!--more-->

## ¿Quién fue Walter Penney?

Walter Francis Penney (1913–2000) fue un matemático y criptoanalista estadounidense. Pasó su carrera en la inteligencia de señales: primero en el grupo de descifrado de la Armada de Estados Unidos, y después durante 34 años en la Agencia de Seguridad Nacional (NSA), donde llegó a ser jefe de división.

Un criptoanalista se pasa la vida mirando largas cadenas de símbolos y haciéndose una pregunta muy concreta: _¿qué patrón aparece primero, y dónde se solapa con otro?_ Encontrar estructuras repetidas en lo que debería parecer aleatorio era todo su trabajo. No sorprende, pues, que Penney, fuera del horario laboral, inventara un juego sobre exactamente eso.

Lo planteó como un pasatiempo — «Problema 95: Penney-Ante» — en el _Journal of Recreational Mathematics_ en octubre de 1969. Podría haberse quedado en una nota al pie de una columna de pasatiempos si **Martin Gardner** no lo hubiera recogido para su columna _Mathematical Games_ en _Scientific American_ en 1974, el momento en que el juego llegó a un público amplio. Penney también era famoso entre los aficionados a los acertijos por su serie «Problema del mes», que se publicó de 1966 a 1974. El juego le sobrevivió; la pregunta que plantea sigue siendo una de las más agudas de la probabilidad.

## La apuesta

Estas son las reglas:

1. Dos jugadores eligen cada uno un patrón de caras y cruces — usaremos patrones de longitud 3.
2. Se lanza una moneda justa repetidamente.
3. Gana el primer jugador cuyo patrón aparezca _como una racha consecutiva_ en la secuencia.

Dos cosas hacen que esto sea distinto de un simple cara o cruz.

Primero, los patrones **se solapan**. Si la secuencia es _O O O X_, entonces _OOO_ aparece en las posiciones 1–3 y _OOX_ aparece en las posiciones 2–4. Un mismo tramo de lanzamientos puede contener varios patrones, y la "carrera" la decide el que se _complete primero_.

Segundo — y esta es toda la historia — **el orden en que elegís importa**. En un cara o cruz normal el pasado es irrelevante (como explorábamos en [el artículo anterior](/es/blog/la-moneda-que-recuerda)). Aquí el pasado _es_ el juego, porque un patrón es una afirmación sobre el **orden** de las cosas, no solo sobre sus recuentos.

## La tabla de los rencores

Tu oponente elige un patrón primero; tú eliges segundo. La tabla te da tu mejor elección y tu probabilidad de ganar:

::penney-graph
---
caption: 'Figura 1: Relación entre los ocho patrones. Cada flecha apunta de un patrón a un patrón al que vence.'
coinSymbolHead: 'O'
coinSymbolTail: 'X'
---
| Oponente | **Tú**  | Tu probabilidad de ganar |
| -------- | ------- | ------------------------ |
| OOO      | **XOO** | 7/8                      |
| OOX      | **XOO** | 3/4                      |
| OXO      | **OOX** | 2/3                      |
| OXX      | **OOX** | 2/3                      |
| XOO      | **XXO** | 2/3                      |
| XOX      | **XXO** | 2/3                      |
| XXO      | **OXX** | 3/4                      |
| XXX      | **OXX** | 7/8                      |
::

Fíjate en la forma. Nunca ganas menos de dos tercios de las veces. Contra los dos patrones extremos, _OOO_ y _XXX_, ganas siete veces de cada ocho.

Y no hay ningún patrón "mejor". A cada patrón lo vence otro, y las relaciones forman un bucle: a _OOO_ lo aplasta _XOO_; a _XOO_ lo vence _XXO_; _XXO_ cae ante _OXX_; _OXX_ pierde contra _OOX_ — al que, a su vez, vence _XOO_. Es **piedra, papel o tijera jugado con monedas**.

::try-this
---
title: 'Pruébalo tú mism@.'
---
Lanza unas cuantas monedas en la [página del juego](/play/) y observa los patrones. Después juega la apuesta con un@ amig@: que elija primero un patrón de tres lanzamientos y usa la tabla de arriba para elegir el tuyo. Ganarás muchas más veces de las que perderás — con una moneda que no está haciendo absolutamente nada "mal".
::

## Por qué ocurre

Cuando eliges _XOO_ contra el _OOO_ de tu oponente, no estás apostando por la moneda. Estás apostando por la **transición**. Fíjate en el contínuo.

El momento peligroso para tu oponente es cuando la secuencia es _O O_ — a un lanzamiento de su _OOO_. Pero esas mismas _OO_ son el _segundo y tercer_ símbolo de tu _XOO_. Si el siguiente lanzamiento es cruz, tu patrón simplemente vuelve a empezar. Tu patrón es _frágil de una forma útil_: puede solaparse consigo mismo, así que un intento fallido no siempre te devuelve a cero.

_OOO_ es lo contrario. Para completarlo necesitas tres caras seguidas, y cualquier cruz borra todo el progreso. _XOO_ puede recuperarse de una cruz; _OOO_ no. El patrón que a alguien podría parecerle el más audaz — es en realidad el peor.

Hay una forma clara de decirlo. Cada patrón tiene una **estructura de autosolapamiento**: cuánto de su propio final puede servir como su propio principio. _OOO_ se solapa consigo mismo por completo (sus dos últimos símbolos son sus dos primeros), lo que hace que sus apariciones lleguen en ráfagas cerradas, de todo o nada. _XOO_ se solapa menos y se puede alcanzar por más caminos.

## Los números de Conway

Las probabilidades exactas de victoria provienen de un método inventado por **John Horton Conway** (1937–2020), el creador del [Juego de La Vida](https://es.wikipedia.org/wiki/Juego_de_la_vida). Una idea simple pero que nos será muy útil

Una cadena de lanzamientos no es más que una cadena de símbolos. Para comparar dos cadenas, desliza una a lo largo de la otra y pregúntate, en cada alineación, _¿coincide el final de una con el principio de la otra?_ Escribe `1` cuando coincidan y `0` cuando no. Esa cadena de _bits_ es el **número conductor** — o número de Conway — de ese par ordenado: una huella compacta de cómo se solapan los dos patrones.

Toma $A = OOO$ y $B = XOO$. Para cada par ordenado, compara los últimos $r$ símbolos del primer patrón con los primeros $r$ símbolos del segundo, de $r = 3$ hasta $r = 1$, y pondera una coincidencia en $r$ con $2^{r-1}$:

**AA — _OOO_ sobre _OOO_:**

| $r$ | últimos $r$ de A | primeros $r$ de A | ¿coincide?       | peso |
| --- | ---------------- | ----------------- | ---------------- | ---- |
| 3   | OOO              | OOO               | OOO=OOO; ✓ (`1`) | 4    |
| 2   | OO               | OO                | OO=OO; ✓ (`1`)   | 2    |
| 1   | O                | O                 | O=O; ✓ (`1`)     | 1    |

Los bits son `111`, y en **binario**, $111_2$ es $7$, así que **AA = 7**.

Los otros tres salen así:

- **AB** (_OOO_ sobre _XOO_): ninguna alineación coincide (OOO≠XOO; OO≠XO; O≠X)
  - `000` → **AB = 0**
- **BB** (_XOO_ sobre _XOO_): solo coincide $r = 3$ (XOO=XOO; OO≠XO; O≠X)
  - `100` → **BB = 4**
- **BA** (_XOO_ sobre _OOO_): coinciden $r = 2$ y $r = 1$ (XOO≠OOO; OO=OO; O=O)
  - `011` → **BA = 3**

Juntos forman una matriz 2×2:

|             | A = OOO | B = XOO |
| ----------- | ------- | ------- |
| **A = OOO** | 7       | 0       |
| **B = XOO** | 3       | 4       |

Y la carrera se decide comparando el solapamiento de cada patrón consigo mismo con su solapamiento con el oponente:

$$\text{probabilidades de que } B \text{ venza a } A = (AA - AB) : (BB - BA) = (7 - 0) : (4 - 3) = 7 : 1$$

Siete a uno, con tres líneas de aritmética. Sin simulación, sin una infinidad de lanzamientos: solo la estructura de solapamiento, escrita en binario. Los números conductores no son una contabilidad; _son_ la estructura de solapamiento.

## El artículo que demostró el truco

El algoritmo de Conway era elegante, pero durante años se presentó sin demostración. La demostración llegó en 1982, de la mano de **Stanley Collings**, que introdujo la cantidad que hace que todo encaje: el **tiempo de espera medio**, el número esperado de lanzamientos hasta que un patrón aparece por primera vez. Collings demostró tres resultados que convierten los números conductores en tiempos reales:

| Teorema | Qué da                                                      | En palabras llanas                            |
| ------- | ----------------------------------------------------------- | --------------------------------------------- |
| **X**   | $E[\text{espera de } A] = 2 \cdot AA$                       | cuánto tarda A en aparecer por sí solo        |
| **Y**   | $E[\text{espera de } A \mid B] = 2 \cdot AA - 2 \cdot BA$   | la ventaja que heredas si B acaba de aparecer |
| **Z**   | probabilidades de $B$ antes que $A = (AA - AB) : (BB - BA)$ | quién gana la carrera, y por cuánto           |

Para _OOO_: $2 \times 7 = 14$ lanzamientos de media. Para _XOO_: $2 \times 4 = 8$. El único número `111₂` ya conocía ambas respuestas.

Esta es la parte que me parece genuinamente bella. La moneda no tiene memoria, pero el _patrón_ sí: su final puede ser su propio principio, y ese autosolapamiento es exactamente lo que miden los números conductores. La aritmética de Conway no es un atajo para esquivar las probabilidades: es las probabilidades, escritas en la geometría de las propias cadenas.

Una exposición moderna y legible de la demostración de Collings es un [artículo de 2012 de **Yutaka Nishiyama**](https://www.researchgate.net/publication/259609321_Pattern_matching_probabilities_and_paradoxes_as_a_new_variation_on_penney's_coin_game), que reformula los tres teoremas con claridad y amplía el juego.

**Yutaka Nishiyama** (n. 1948) es un matemático japonés de la Universidad de Economía de Osaka, conocido como el «profesor boomerang» por su trabajo sobre los boomerangs y por una larga serie de libros sobre las matemáticas de la vida cotidiana (el 6174 de Kaprekar, la forma de los huevos, los flexágonos). [Su página web](http://yutaka-nishiyama.sakura.ne.jp/) reúne el resto.

## La espera engañosa

Ahora se tuercen las cosas. Hay dos preguntas distintas que puedes hacerle a un patrón, y una moneda justa las responde de forma diferente:

1. **¿Cuánto tarda este patrón en aparecer por sí solo?** Es su :term[tiempo de espera medio]{slug='tiempo-de-espera-medio'}, escrito $W$: el número esperado de lanzamientos hasta que el patrón aparece por primera vez.
2. **Si este patrón y otro compiten, ¿cuál es más probable que aparezca primero?**

Tu instinto dice que el patrón con el tiempo de espera medio más corto debería ganar la carrera. A menudo es así. Pero no siempre.

El Teorema X de Collings nos dice cómo calcular $W$: es el doble del número conductor _propio_ del patrón. En concreto, sea $L(S)$ el conjunto de longitudes $r$ para las que los últimos $r$ símbolos de $S$ son iguales a sus primeros $r$ símbolos — los autosolapamientos del patrón. Entonces

$$W(S)=\sum_{r\in L(S)} 2^{r}$$

Para _OOO_ los autosolapamientos son $r=1,2,3$, así que $W(OOO)=2+4+8=14$. Para _XOO_ solo $r=3$ es un autosolapamiento, así que $W(XOO)=2^3=8$. Cuanto más se solapa un patrón consigo mismo, más tiende a tardar en aparecer.

Así que _OOO_ tarda casi el doble que _XOO_, y pierde la carrera: esa parte es intuitiva. Ahora mira un par en el que el instinto se rompe:

| Par de patrones  | tiempo de espera medio       | Probabilidad de que gane el primero    |
| ---------------- | ---------------------------- | -------------------------------------- |
| _XOXO_ vs _OXOO_ | $W(XOXO)=20$ vs $W(OXOO)=18$ | $P(\text{XOXO antes que OXOO}) = 9/14$ |
| _XXOO_ vs _OOO_  | $W(XXOO)=16$ vs $W(OOO)=14$  | $P(\text{XXOO antes que OOO}) = 7/12$  |
| _XOOO_ vs _OOO_  | $W(XOOO)=16$ vs $W(OOO)=14$  | $P(\text{XOOO antes que OOO}) = 7/8$   |

La primera fila es el propio ejemplo de Collings. _XOXO_ tarda **más** en aparecer de media que _OXOO_ — 20 lanzamientos frente a 18 — y sin embargo _XOXO_ es el favorito para aparecer primero, nueve veces de cada catorce. La segunda y la tercera fila muestran la misma inversión frente a _OOO_: es el patrón **más rápido** en ambas — tiempo de espera medio 14, menor que 16 — y **pierde la carrera** en las dos. Contra _XOOO_ pierde siete veces de cada ocho. Contra _XXOO_ pierde más de la mitad de las veces.

> "Llega antes de media" y "gana la carrera" son preguntas distintas. Una moneda justa las responde de forma distinta.

Collings, que fue el primero en escribir esto, lo llamó _una paradoja dentro de una paradoja_. Parece una contradicción hasta que ves por qué las preguntas se separan. Un tiempo de espera medio se calcula sobre miles de ejecuciones separadas e independientes. Una carrera es una única secuencia compartida, en la que la llegada de un patrón puede bloquear al otro antes de que siquiera empiece. La media es un hecho sobre muchos mundos; la carrera es un hecho sobre uno.

## La misma moneda, en todas partes

El bucle que encontramos no es un truco de monedas. Es una estructura general llamada :term[no-transitividad]{slug='no-transitivo'}: un juego sin mejor jugada, solo una mejor jugada _contra algo_. Una vez que la ves, la encuentras en todas partes:

- **Piedra, papel o tijera** es el ejemplo más puro: ningún gesto vence a los otros dos, pero cada gesto vence a uno y pierde contra otro.
- [**Los dados no transitivos**](https://es.wikipedia.org/wiki/Dados_no_transitivos) existen de la misma forma: conjuntos de dados en los que cada dado es más probable que venza al siguiente, dando vueltas y vueltas.
- **Los ciclos de Condorcet** en las votaciones: con tres candidatos, una mayoría puede preferir A frente a B, B frente a C y C frente a A. Ningún candidato vence a todos los demás, así que no hay una "voluntad del pueblo" que leer — solo el orden en que preguntas.

En biología tenemos muchos ejemplos. Entre ellos, en un llamativo experimento de 2020, unos investigadores diseñaron tres cepas de _E. coli_ que se matan entre sí en un bucle: 🔴 la Roja mata a la Verde, 🟢 la Verde mata a la Azul y 🔵 la Azul mata a la Roja. Pero las matanzas no son igual de fuertes: la toxina de la Roja es, con diferencia, la más letal. Cabría esperar que la Roja, la más fuerte, se hiciera con la placa. Pero no es lo que pasa. La Roja mata a su víctima tan rápido que pronto se enfrenta al único enemigo que no puede vencer, mientras la cepa más suave, ignorada porque no es una amenaza inmediata para nadie, sobrevive, se extiende y acaba heredándolo todo. Los autores lo llamaron [**supervivencia del más débil**](https://www.nature.com/articles/s41467-020-19963-8). En un mundo no transitivo, la "mejor arma" es una carga pesada.

En cada uno de estos ejemplos, ninguna opción individual tiene nada de malo. El ciclo aparece solo cuando las comparas de dos en dos.

## No hay ningún patrón más fuerte

Penney se pasó la vida leyendo secuencias que alguien más intentaba mantener en secreto. No es difícil ver por qué un juego sobre qué patrón aparece primero le resultaría atractivo: en criptoanálisis la respuesta nunca depende solo de los símbolos. Descifrar un mensaje oculto tiene mucho que ver con reconocer patrones.

Lo que dejó es más que un truco matemático. Es una demostración pequeña y perfecta de una idea más grande: si no existe una estrategia que venza a todas las demás, entonces "la mejor" no es una propiedad que una estrategia tenga por sí sola. Es una propiedad de la **relación** entre dos jugadores en el tiempo. La fuerza es relacional. Un patrón es fuerte solo por el patrón al que se enfrenta. El mismo patrón en otro momento se convierte en la estrategia perdedora.

Por eso la paradoja del tiempo de espera y el experimento con _E. coli_ son la misma historia. En un mundo cíclico, ser el más fuerte no es una posición segura: es la posición que tiene un depredador. La cepa más letal es la que se compromete en exceso y se expone. La "más débil" gana porque no es el objetivo de nadie hasta que ya es demasiado tarde. Y ese mismo autosolapamiento que decide el juego de la moneda es lo que hace que la fuerza de un patrón sea relacional: el final que te ayuda contra un oponente es el final que te traiciona contra otro.

La no-transitividad es también la forma de la mayoría de los desacuerdos reales. Cuando A vence a B, B vence a C y C vence a A, ninguna clasificación cuidadosa producirá un orden estable — no porque los jugadores sean irracionales, sino porque la propia relación contiene un ciclo.

Así que quizá el uso más antiguo de la moneda — producir un ganador, limpiamente y sin discusión — lleva tiempo diciéndonos lo contrario de lo que suponíamos. Una moneda justa puede zanjar una discusión en una decisión binaria. Pero no puede decirte cuál de tres cosas es la mejor, porque "mejor" puede que no exista. Lo que existe es el ciclo, y cada posición en él es la fuerza de alguien y la debilidad de otro.

Nos pasamos mucho tiempo buscando el mejor patrón que jugar. La moneda sugiere una pregunta más honesta: no _¿cuál es la mejor jugada?_, sino _¿es este el momento adecuado, y es este el rival adecuado?_ En un mundo de ciclos, ganar tiene menos que ver con ser el más fuerte y más con estar en el lugar correcto en el momento correcto.

## Ver también

:term[Juego de Penney]{slug='juego-de-penney'} · :term[Número conductor]{slug='numero-conductor'} · :term[Tiempo de espera medio]{slug='tiempo-de-espera-medio'} · :term[No transitivo]{slug='no-transitivo'}

## Referencias

- Penney, W. «Problem 95. Penney-Ante». _Journal of Recreational Mathematics_, 1969. Resumen: [juego de Penney](https://es.wikipedia.org/wiki/Juego_de_Penney).
- Nishiyama, Y. «Pattern Matching Probabilities and Paradoxes — A New Variation on Penney's Coin Game». _Osaka Keidai Ronshu_, 2012. [ResearchGate](https://www.researchgate.net/publication/259609321_Pattern_matching_probabilities_and_paradoxes_as_a_new_variation_on_penney's_coin_game)
- Collings, S. «Coin Sequence Probabilities and Paradoxes». _Bulletin of the Institute of Mathematics and its Applications_, 1982. [PDF escaneado](https://yutaka-nishiyama.sakura.ne.jp/math/stanley_collings.pdf)
- Li, S.-Y. R. «A Martingale Approach to the Study of Occurrence of Sequence Patterns in Repeated Experiments». _The Annals of Probability_, 1980. [doi.org/10.1214/aop/1176994578](https://doi.org/10.1214/aop/1176994578)
- Lynn, B. «Penney's Game». [theory.stanford.edu/~blynn/pr/penney.html](https://theory.stanford.edu/~blynn/pr/penney.html) — la deducción con funciones generadoras detrás del algoritmo de Conway.
- Liao, M. J. et al. «Survival of the Weakest in Non-transitive Asymmetric Interactions among Strains of _E. coli_». _Nature Communications_, 2020. [nature.com/articles/s41467-020-19963-8](https://www.nature.com/articles/s41467-020-19963-8)
- Walter Penney (1913–2000): [obituario](https://www.washingtonpost.com/archive/local/2000/06/26/walter-penney-cryptographer-dies-at-87/09b7cefc-fc18-4339-8757-304bd5814704/) · [biografía (FR)](https://fr.wikipedia.org/wiki/Walter_Penney)
- Weisstein, E. W. «Coin Tossing». [MathWorld](https://mathworld.wolfram.com/CoinTossing.html).
