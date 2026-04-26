---
title: Fundamentos de probabilidad
slug: fundamentos-de-probabilidad
_locale: es
description: Aprende los fundamentos de la probabilidad y cómo se relacionan con los lanzamientos de moneda.
published: true
date: 2026-04-23T01:00:00Z
---

# Fundamentos de probabilidad

La probabilidad es una rama de las matemáticas que se ocupa de la verosimilitud de que ocurra un suceso. Es una forma de cuantificar la incertidumbre y medir la probabilidad de distintos resultados. En el contexto de los lanzamientos de moneda, la probabilidad se usa para determinar la verosimilitud de que la moneda caiga en **cara** o en **cruz**.

Este artículo es una introducción al tema de la probabilidad. Nos quedaremos en lenguaje llano y usaremos una moneda como único ejemplo. Estadísticas más avanzadas llegarán en futuros artículos.

## Lo básico

Cuando hablamos de probabilidad, estamos hablando de un concepto matemático que se puede representar de varias formas. La manera más común es como una fracción, un decimal o un porcentaje. Por ejemplo, si lanzas una moneda justa, la probabilidad de que caiga en cara es $\frac{1}{2}$, que es lo mismo que **0,5** o **50%**. Las tres representaciones son equivalentes y se pueden usar indistintamente.

Como veremos en [el artículo La estadística inesperada de los lanzamientos de moneda](https://flipthecoin.app/blog/the-unexpected-statistics-of-coin-flips), la probabilidad real de aterrizaje de una moneda no es exactamente 50-50 cada vez.

## Resultados y sucesos

Antes de seguir, dos piezas pequeñas de vocabulario:

- Un **resultado** es una de las cosas posibles que pueden ocurrir. Cuando lanzas una moneda, los resultados son _cara_, _cruz_ y (muy raramente) _canto_.
- Un **suceso** es una pregunta que hacemos sobre los resultados, como "¿cayó en cara?" o "¿cayó en alguna cara?".

La probabilidad es la herramienta que usamos para ponerle un número a lo probable que es un suceso.

## La escala de probabilidad

Las probabilidades siempre viven en una escala de **0 a 1**:

- **0** significa que el suceso es imposible. Una moneda convirtiéndose en paloma en pleno vuelo tiene probabilidad 0.
- **1** significa que el suceso es seguro. Una moneda lanzada al aire acabando por caer, gracias a la gravedad, tiene probabilidad 1.
- Cualquier cosa entre medias es "algo probable". Una moneda justa cayendo en cara se sitúa justo en el medio, en **0,5**.

En términos de porcentaje, esa misma escala va del **0%** al **100%**. La misma idea, expresada de otra forma.

## La regla del complemento

Cada suceso tiene una imagen espejo llamada su **complemento**: el suceso de que _no_ ocurra. Y como algo o bien ocurre o bien no, las dos probabilidades siempre suman 1. En símbolos:

$$P(\text{no } A) = 1 - P(A)$$

Para una moneda justa:

- $P(\text{cara}) = 0,5$, así que $P(\text{no cara}) = 1 - 0,5 = 0,5$.
- $P(\text{cara o cruz}) \approx 1 - \tfrac{1}{6000} \approx 0,99983$, porque la única otra opción es el raro "canto". (Más sobre ese 1 entre 6000 en [La estadística inesperada de los lanzamientos de moneda](https://flipthecoin.app/blog/the-unexpected-statistics-of-coin-flips).)

La regla del complemento suele ser la forma más fácil de calcular una probabilidad: en lugar de contar todas las formas en que algo _puede_ pasar, cuenta la única forma en que _no puede_ y réstala a 1.

## Combinar sucesos: "y" vs "o"

La cosa se pone interesante cuando preguntamos por más de un lanzamiento a la vez. Dos reglas cubren casi todo lo que necesitarás:

### "Y" — ambas cosas ocurren

Los lanzamientos de moneda no se influyen entre sí (son **independientes**). En este caso, **multiplicas** sus probabilidades:

- $P(\text{CC}) = 0,5 \times 0,5 = 0,25$, o 25%.
- $P(\text{CCC}) = 0,5 \times 0,5 \times 0,5 = 0,125$, o 12,5%.

Cada lanzamiento extra reduce la probabilidad a la mitad. Por eso las rachas largas resultan sorprendentes — no porque la moneda esté "tocada" para el otro lado, sino porque cada nuevo lanzamiento añade otro $\tfrac{1}{2}$ al producto.

### "O" — al menos una de varias cosas ocurre

Si dos resultados **no pueden ocurrir al mismo tiempo** (son **mutuamente excluyentes**), **sumas** sus probabilidades:

- $P(\text{C} \cup \text{X}) = 0,5 + 0,5 = 1$. Nada sorprendente — eso es cualquier resultado no-canto.
- $P(1 \cup 2) = \tfrac{1}{6} + \tfrac{1}{6} = \tfrac{2}{6}$ (sacar un 1 o un 2 en un dado de seis caras).

Si los sucesos _pueden_ solaparse, la simple suma cuenta doble el solape y tienes que restarlo:

$$P(A \cup B) = P(A) + P(B) - P(A \cap B)$$

Eso es el **principio de inclusión–exclusión**, y su versión más profunda es tema para un futuro artículo.

## Una nota rápida sobre independencia

Dos sucesos son **independientes** cuando el resultado de uno no cambia la probabilidad del otro. Los lanzamientos de moneda son el ejemplo de libro: la moneda no tiene memoria, así que una racha de diez caras seguidas no hace que la cruz sea más probable en el undécimo lanzamiento.

Este es el montaje detrás de la famosa **Falacia del jugador**, que desgrano en [el artículo de estadísticas](https://flipthecoin.app/blog/the-unexpected-statistics-of-coin-flips#the-gamblers-fallacy). Por ahora, la versión corta: cada lanzamiento es un nuevo comienzo.

## Conclusión

Eso es realmente todo para lo básico:

1. Las probabilidades viven entre 0 y 1.
2. Usa el **complemento** (1 − P) cuando sea más fácil contar lo que _no_ ocurre.
3. **Multiplica** para el "y", **suma** para el "o" mutuamente excluyente.
4. Los sucesos independientes no se preocupan por la historia del otro.

Con solo esas cuatro ideas puedes razonar sobre casi cualquier pregunta de lanzamiento de moneda — y sobre la mayoría de problemas tipo dados, cartas y lotería también.
