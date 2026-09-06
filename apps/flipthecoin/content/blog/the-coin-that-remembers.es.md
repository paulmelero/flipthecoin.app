---
title: 'La moneda que recuerda'
slug: la-moneda-que-recuerda
series: Chaos
seriesOrder: 4
_locale: es
description: 'Una moneda tiene un pasado, pero cuando estudiamos probabilidad, tratamos habitualmente los lanzamientos sucesivos como independientes.'
published: true
level: advanced
date: 2026-08-19T10:00:00Z
tags:
  - paseo aleatorio
  - sin memoria
  - ausencia de memoria
  - proceso de Markov
  - distribución geométrica
  - distribución exponencial
  - número e
  - lanzamiento de moneda
  - probabilidad
  - matemáticas
  - física
  - causalidad
  - aleatoriedad
  - sesgo
---

# La moneda que recuerda

Voy a introducir el concepto de "ausencia de memoria". A menudo decimos que una moneda no tiene memoria. Pero me gustaría explicarla mejor. A algun@s les sonará quizás el concepto de "Propiedad de Markov". Si no es así, no os preocupéis, vamos a paso a paso.

<!--more-->

Lanza una moneda **justa** y saca cara. Lánzala de nuevo, y el resultado anterior no debería importar. Saca cara diez veces seguidas y, en el undécimo lanzamiento, cara sigue siendo exactamente igual de probable que cruz. La probabilidad de tener un hijo cuando tus dos primeaos hijas fueron niñas [sigue siendo $\tfrac{1}{2}$](https://woddsup.com/e/1/5/third-child-same-sex).

Una moneda justa no sabe qué ocurrió antes. No tiene memoria, ni recuerdo, ni conciencia de su pasado. Debería ser puramente aleatoria, justa, perfecta.

Pero una moneda real **sí** recuerda. No conscientemente, por supuesto. Pero físicamente.

## Una moneda real recuerda su pasado

Cuando lanzas una moneda, su resultado final no se crea de la nada, sino que sale del estado en el que la lanzaste: su orientación inicial, su posición, velocidad, momento angular, la forma en que gira y las fuerzas que actúan sobre ella mientras vuela por el aire.

Si conociéramos todas esas cantidades con suficiente precisión, la mecánica clásica nos diría dónde debería caer la moneda.

La moneda no se vuelve repentinamente aleatoria cuando sale de tu mano.

De hecho, [los experimentos de Persi Diaconis, Susan Holmes y Richard Montgomery](https://www.stat.berkeley.edu/~aldous/157/Papers/diaconis_coinbias.pdf) descubrieron que una moneda lanzada de forma natural tiene una pequeña pero medible tendencia a caer en la misma cara en la que empezó. En sus experimentos, esa probabilidad era de alrededor del 51%, en lugar del 50% idealizado.

Así que si la moneda empieza cara arriba, esa información no ha desaparecido completamente.

Decimos que la moneda física tiene **memoria**.

Y sin embargo, cuando estudiamos probabilidad, tratamos habitualmente los lanzamientos sucesivos como independientes. ¿Es eso una contradicción?

En realidad, no. Es la diferencia entre el **mundo físico** y el **modelo matemático que elegimos para describirlo**.

Un lanzamiento físico de moneda es causal. Dadas unas condiciones iniciales suficientemente detalladas, su movimiento sigue las leyes de la física. También puede ser extremadamente sensible a esas condiciones iniciales. Una diferencia microscópica en la forma de lanzar la moneda puede eventualmente producir un resultado distinto. Y desde nuestro punto de vista, como no podemos medir todas esas condiciones iniciales con precisión infinita, el resultado es efectivamente aleatorio.

La aleatoriedad, en otras palabras, no significa necesariamente **ausencia de causalidad** cuando miramos de cerca los detalles físicos de un proceso. Puede simplemente significar que no tenemos acceso a toda la información y necesitamos simplificar el modelo para que sea abordable.

## ¿Qué significa realmente "sin memoria" ("memoryless" en inglés)?

Cuando la teoría de la probabilidad dice que los lanzamientos sucesivos son independientes, no está afirmando que una moneda física haya olvidado literalmente su pasado.

Está describiendo un **proceso idealizado** en el que conocer los resultados anteriores no nos da información sobre el siguiente.

Esta idea se vuelve mucho más interesante cuando pasamos de los lanzamientos a los :term[procesos estocásticos]{slug='proceso-estocastico'}, como vimos en el [artículo anterior "¿Por qué una moneda justa pasa casi toda su vida pareciendo injusta?"](https://flipthecoin.app/es/blog/moneda-justa-paseo-aleatorio-ley-del-arcoseno).

Un proceso estocástico es simplemente un sistema que evoluciona en el tiempo mientras involucra algún elemento de aleatoriedad. Nuestro familiar "paseo aleatorio" es uno: empieza en cero, mueve un paso hacia arriba (↗️) para cara y un paso hacia abajo () para cruz, y así sucesivamente.

### Markov

Una clase de procesos estocásticos particularmente importantes son los :term[procesos de Markov]{slug='proceso-de-markov'}.

La propiedad de Markov dice algo sorprendentemente concreto:

> **Una vez que conoces el estado presente, conocer todo el pasado no te da información adicional sobre el futuro.**

El presente puede contener todo lo que importa del pasado. Para un lanzamiento de moneda, el estado presente es todos sus resultados anteriores colapsados en un único valor, concentrados en un estado único.

Ese es un significado mucho más preciso de "sin memoria", una forma más fina de describir el concepto.

## El lanzamiento de moneda tiene un primo discreto sin memoria

Hay una forma aún más directa de encontrar esta idea con una moneda.

Imagina lanzar una moneda justa hasta que salga la primera cara.

¿Cuántos lanzamientos necesitarás?

La respuesta es incierta. Puede que salga cara inmediatamente:

```
O
```

O puede que necesites:

```
X X X O
```

O tal vez:

```
X X X X X X X O
```

Ahora supón que ya has lanzado la moneda cinco veces sin salir ninguna cara.

¿Eso cambia la probabilidad de que necesites esperar otros tres lanzamientos? **No**.

La moneda no se vuelve más propensa a producir cara porque hayas estado esperando un rato.

El número de lanzamientos hasta la primera cara sigue una :term[distribución geométrica]{slug='distribucion-geometrica'}, y la distribución geométrica tiene la notable propiedad de ser :term[sin memoria]{slug='ausencia-de-memoria'}.

Si ya has esperado $n$ lanzamientos, la probabilidad de esperar otros $m$ lanzamientos es exactamente la misma que habría sido al principio.

En notación matemática,

$$
P(N>n+m\mid N>n)=P(N>m)
$$

Esto se lee como:

> La probabilidad de que $N$ sea mayor que $n+m$, dado que $N$ es mayor que $n$, es igual a la probabilidad de que $N$ sea mayor que $m$.

En otras palabras, si ya has esperado $n$ lanzamientos, la probabilidad de esperar al menos otros $m$ lanzamientos es exactamente la misma que la probabilidad de esperar $m$ lanzamientos desde el principio.

Los $n$ lanzamientos que ya hemos aguantado simplemente desaparecen de la ecuación.

Esa es la ausencia de memoria en su forma matemática más pura.

Pero algo aún más bello ocurre **cuando dejamos de contar lanzamientos**.

## De lanzamientos a tiempo

En lugar de preguntar:

> ¿Cuántos lanzamientos de moneda hasta que ocurra algo?

imagina que preguntamos:

> ¿Cuánto tiempo tiene que pasar hasta _que ocurra algo_?

Ahora el tiempo es **continuo** en lugar de una secuencia de pasos discretos.

Supón que los eventos ocurren aleatoriamente a una tasa media constante $\lambda$. ¿Cuál es la probabilidad de que sigamos esperando después del tiempo $t$?

La respuesta es:

$$
S(t)=P(T>t)=e^{-\lambda t}
$$

Y qué aparición tan sorprendente.

**$e$**

El número $2.71828\ldots$ ha aparecido en nuestra historia de lanzamientos de moneda.

Pero ¿por qué? ¿Por qué este número tan fundamental en matemáticas?

## La forma del olvido

> **/olˈbi.ðo/**
>
> _sustantivo_
>
> estado de ser olvidado o dejar de ser recordado.

La respuesta se esconde dentro de la propia **propiedad sin memoria**.

Supón que ya hemos esperado $s$ segundos. ¿Cuál es la probabilidad de que tengamos que esperar otros $t$ segundos?

La ausencia de memoria exige que esto dependa solo de $t$, no del tiempo que ya llevamos esperando:

$$
P(T>s+t\mid T>s)=P(T>t).
$$

Leemos esto como:

> La probabilidad de que $T$ sea mayor que $s+t$, dado que $T$ es mayor que $s$, es igual a la probabilidad de que $T$ sea mayor que $t$.

Usando la fórmula exponencial y resolviendo algebraicamente (omitimos los detalles para este artículo pero puedes encontrar la derivación en [el artículo de Wikipedia en inglés](https://en.wikipedia.org/wiki/Memorylessness#Characterization_of_exponential_distribution)), obtenemos:

$$
S(t)=e^{-\lambda t}.
$$

Y fíjate qué curioso.

El tiempo que ya hemos esperado, $s$, se cancela.

La función exponencial no es meramente _una_ función que resulta describir la ausencia de memoria. Es la forma matemática continua de esta idea.

La expresión anterior puede entenderse como:

> Si ya hemos esperado $s$ segundos, la probabilidad de esperar al menos otros $t$ segundos es exactamente la misma que la probabilidad de esperar $t$ segundos desde que empezamos a contar.

Un nuevo comienzo. Olvidando el pasado.

Hay una forma igualmente bella de ver por qué $e$ aparece aquí.

La **función exponencial** tiene la propiedad única de que su tasa de cambio es proporcional a sí misma:

$$
\frac{d}{dt}e^t=e^t.
$$

Una cantidad puede por tanto crecer o decrecer continuamente mientras siempre cambia a una tasa determinada por su tamaño actual.

Visto de otra manera, $e^t$ crece a una tasa constante y en cualquier momento, su crecimiento futuro sigue rigiéndose por la misma regla $e^t$.

Por eso $e$ aparece en todas partes donde encontramos crecimiento y decaimiento continuos: poblaciones, desintegración radiactiva, interés compuesto, difusión, ecuaciones diferenciales; y, aquí, la probabilidad de esperar a que ocurra algo.

La misma estructura matemática sigue regresando. Me parece fascinante cómo a menudo las mismas ideas matemáticas aparecen en diferentes contextos.

## La moneda es un modelo de juguete

Una moneda justa es un [modelo de juguete](https://es.wikipedia.org/wiki/Modelo_de_juguete).

No es una descripción perfecta de una moneda real. Dejamos fuera deliberadamente casi todo: la forma de la moneda, su giro, la resistencia del aire, la fuerza con la que la lanzamos, su orientación inicial, sus imperfecciones. Nos quedamos solo con lo que necesitamos para responder a la pregunta que queremos plantear: ¿cara o cruz?

Esto es lo que hacen los matemáticos. Simplifican el mundo hasta quedarse con lo esencial y, después, estudian las consecuencias de esa simplificación hasta que algo fundamental se hace visible.

En el caso de la moneda, la **independencia** nos permite olvidar los detalles del lanzamiento anterior. En un proceso de Markov, el **estado presente** contiene toda la información del pasado que importa para predecir el futuro. Y en la distribución exponencial, el **tiempo que ya hemos esperado puede desaparecer** por completo del cálculo.

El mundo real es más complicado. Pero el modelo de juguete puede revelar algo que esa complejidad ocultaba.

Una moneda justa es aleatoria por construcción. La moneda real es determinista, pero su movimiento puede ser extremadamente sensible a sus condiciones iniciales (recuerdas el [movimiento browniano](https://flipthecoin.app/es/blog/moneda-justa-paseo-aleatorio-ley-del-arcoseno)?).

> **La aleatoriedad y el caos pueden parecerse desde fuera, pero no son lo mismo.**

Quizá por eso una humilde moneda sea un objeto tan útil sobre el que pensar. Es lo bastante sencilla como para enseñarnos probabilidad, pero no tanto como para alejarse del mundo real.

Todo depende de los detalles que decidamos incluir o ignorar.
