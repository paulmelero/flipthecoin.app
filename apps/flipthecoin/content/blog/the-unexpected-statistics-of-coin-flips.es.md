---
title: La estadística inesperada de los lanzamientos de moneda
slug: la-estadistica-inesperada-de-los-lanzamientos-de-moneda
_locale: es
description: Un vistazo a lo que realmente ocurre cuando lanzas una moneda — los casos extremos, la falacia del jugador y por qué las monedas justas no lo son tanto.
published: true
date: 2025-03-22T01:00:00Z
---

# La estadística inesperada de los lanzamientos de moneda

Probablemente hayas lanzado una moneda en algún momento de tu vida. Quizás la lanzaste para decidir quién empezaba en un juego, o para decidir dónde ir a cenar. Pero, ¿te has parado alguna vez a pensar en la estadística de los lanzamientos de moneda?

## Lo básico

Una moneda tiene dos caras: cara y cruz. Cuando la lanzas, en teoría hay un 50% de probabilidad de que caiga en cara y un 50% de que caiga en cruz. Esto es porque la moneda tiene dos caras y cada una tiene la misma probabilidad de quedar arriba.

Pero hay otro caso en el que la moneda puede caer sobre su canto. Es un suceso raro, pero es posible. La probabilidad de que una moneda caiga sobre su canto es muy baja, pero no es cero. Se estima que la probabilidad de que una moneda caiga sobre su canto es de aproximadamente 1 entre 6000 lanzamientos dependiendo de las condiciones ([fuente](https://ui.adsabs.harvard.edu/abs/1993PhRvE..48.2547M/abstract)).

Este es el verdadero "caso borde" en los lanzamientos de moneda. Pero no te confundas, no está relacionado con el origen de la expresión. Lee más sobre de dónde viene el término ["edge case"](https://flipthecoin.app/blog/where-does-the-term-edge-case-come-from).

Aprende más sobre cómo lanzamos una moneda en FlipTheCoin.app [aquí](https://flipthecoin.app/blog/how-we-toss-a-coin).

## La realidad

En realidad, la estadística de los lanzamientos de moneda es un poco más complicada. Por ejemplo, si lanzas una moneda 100 veces, quizás no obtengas exactamente 50 caras y 50 cruces. De hecho, podrías obtener 60 caras y 40 cruces, o 55 caras y 45 cruces. Esto es porque hay un elemento de aleatoriedad en los lanzamientos, y el resultado de cada lanzamiento no es del todo predecible.

Podrías culpar de esto a que la moneda no está perfectamente equilibrada, o a que la persona que la lanza no es perfectamente consistente en su técnica. Pero la verdad es que incluso con una moneda perfectamente equilibrada y un lanzador perfectamente consistente, seguirá habiendo algo de variación en los resultados. Ver la sección [Falacia del jugador](#the-gamblers-fallacy) más abajo.

💡 Si quieres ver una simulación ideal de lanzamiento de moneda, mira la [herramienta del motor de lanzamiento](https://flipthecoin.app/toss-engine). Está diseñada para ser lo más justa matemáticamente posible (y excluye los casos de "canto") usando el método `Math.random()` de JavaScript para simular el lanzamiento.

## La injusticia de las monedas justas

Recientemente, un grupo de investigadores holandeses publicó un [artículo](https://arxiv.org/abs/2310.04153) que exploraba la estadística de los lanzamientos de moneda con más detalle. Descubrieron que el resultado de un lanzamiento está influido por una variedad de factores, incluidas las condiciones iniciales del lanzamiento. También descubrieron que el resultado no es del todo aleatorio, sino que está influido por esas condiciones iniciales: cuando la gente lanza una moneda corriente, tiende a caer sobre la misma cara con la que empezó.

Por este estudio, fueron condecorados con el [Premio Ig Nobel](https://improbable.com/ig/winners/#ig2024) en 2024.

## La falacia del jugador

Una idea equivocada común sobre los lanzamientos de moneda se conoce como la Falacia del Jugador. Es la creencia errónea de que, si una moneda ha caído en cara varias veces seguidas, es más probable que caiga en cruz en el siguiente lanzamiento. En realidad, cada lanzamiento es independiente de los anteriores, y el resultado de uno no afecta al resultado del siguiente.

Está relacionado con un tema estadístico llamado "independencia". En estadística, dos sucesos se consideran **independientes** si la ocurrencia de uno no afecta a la probabilidad del otro. En el caso de los lanzamientos de moneda, cada lanzamiento es un suceso independiente, y el resultado de uno no afecta al resultado del siguiente.

Un ejemplo de sucesos dependientes sería sacar cartas de una baraja sin reemplazo. Si sacas una carta de una baraja de 52, la probabilidad de sacar una carta roja es $\tfrac{26}{52}$. Pero si sacas una carta roja y no la repones, la probabilidad de sacar otra roja ahora es $\tfrac{25}{51}$. El primer suceso ha afectado a la probabilidad del segundo.

💡 Si quieres saber más sobre qué significa tener una probabilidad de $\tfrac{26}{52}$ o $\tfrac{25}{51}$, mira el artículo [Fundamentos de probabilidad](https://flipthecoin.app/blog/probability-basics).

## La ley de los grandes números

La ley de los grandes números dice que, cuantas más veces lances una moneda, más se acercarán los resultados a la partición teórica 50/50. Por ejemplo, si lanzas una moneda 10 veces, podrías obtener 6 caras y 4 cruces. Pero si la lanzas 1 millón de veces, es más probable que te acerques al 50/50.

En la práctica, la ley de los grandes números no es siempre perfecta. Seguirá habiendo algo de variación en los resultados, incluso con un **número muy grande** de lanzamientos. Pero cuantas más veces lances la moneda, más se acercarán los resultados a la partición teórica 50/50.

### ¿Cuántas veces deberías lanzar una moneda para obtener un 50/50?

En teoría, cuantas más veces la lances, más se acercarán los resultados a un 50/50. Pero, ¿llegas a un punto en que los resultados son exactamente 50/50?

La respuesta es no. Incluso si lanzas una moneda un número infinito de veces, nunca obtendrás exactamente un 50/50. Esto está relacionado con el concepto de **desviación estándar** en estadística. La desviación estándar mide cómo de dispersos están los valores en un conjunto de datos. En el caso de los lanzamientos, mide cuánto se alejan los resultados de la partición teórica 50/50.

Imagina que lanzamos la moneda 1000 veces. La probabilidad de obtener **exactamente** 500 caras y 500 cruces es muy baja. De hecho, está alrededor del 2,5% ([fuente](https://www.wolframalpha.com/input?i=probability+of+getting+exactly+500+heads+and+500+tails+in+1000+flips+of+a+fair+coin)). Los rangos, como que el 95% de las veces caiga entre 469 y 530 caras, o el 99% entre 450 y 550, se derivan usando la **distribución binomial** y la **desviación estándar**. Estas herramientas estadísticas ayudan a describir la dispersión de resultados en ensayos repetidos. Para aclarar: esto significa que el 99% de las veces que lanzas una moneda 1000 veces, el resultado cae en ese rango.

## Conclusión

La estadística de los lanzamientos de moneda es un tema fascinante que puede enseñarnos mucho sobre probabilidad y aleatoriedad.

Se usa comúnmente como uno de los primeros ejemplos al enseñar estadística, pero también es un tema que puede explorarse en más profundidad. Es un concepto simple que puede llevar a discusiones complejas sobre independencia, aleatoriedad y la ley de los grandes números. Para algunas personas es solo una forma divertida de tomar decisiones, para otras es una forma de explorar el mundo de la estadística.

Así que la próxima vez que lances una moneda, tómate un momento para apreciar la estadística inesperada detrás de este simple acto.
