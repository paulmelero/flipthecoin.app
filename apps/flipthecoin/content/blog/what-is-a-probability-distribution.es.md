---
title: ¿Qué es una distribución de probabilidad?
slug: que-es-una-distribucion-de-probabilidad
series: probability-basics
seriesOrder: 3
_locale: es
description: Una introducción amable a las distribuciones de probabilidad y a la distribución binomial, con un tablero de Galton interactivo para experimentar.
published: true
level: beginner
date: 2026-06-12T10:00:00Z
tags:
  - Distribución de probabilidad
  - Distribución binomial
  - Francis Galton
  - Campana de Gauss
  - Tablero de Galton
---

# ¿Qué es una distribución de probabilidad?

Lanza una moneda una vez y el resultado es solo un lanzamiento. Lánzala cien veces y aparece algo más interesante: una _forma_. Cuenta con qué frecuencia ocurre cada resultado y ya no estarás mirando la suerte, sino una **distribución de probabilidad**. Este breve artículo explica qué significa eso, presenta la distribución más famosa nacida de los lanzamientos de moneda y te deja verla construirse, bola a bola, en un tablero de Galton interactivo.

<!--more-->

## Una distribución es solo un mapa de "qué tan probable"

Una **distribución de probabilidad** es la respuesta completa a la pregunta _"¿qué puede pasar y qué tan probable es cada cosa?"_. Empareja cada resultado posible con su probabilidad.

Para un único lanzamiento de una moneda justa, la distribución es diminuta:

$$P(\text{cara}) = \tfrac{1}{2}, \qquad P(\text{cruz}) = \tfrac{1}{2}$$

Dos resultados, cada uno con probabilidad un medio. Hay una regla que una distribución nunca puede romper: **todas las probabilidades tienen que sumar 1**, porque _algo_ siempre ocurre.

$$\tfrac{1}{2} + \tfrac{1}{2} = 1$$

Esa es toda la idea. Las distribuciones se vuelven interesantes no cuando ocurre un solo suceso, sino cuando repetimos un experimento muchas veces y nos preguntamos cómo se reparten los resultados. (Si las palabras _probabilidad_ y _verosimilitud_ todavía te resultan resbaladizas, empieza por [Fundamentos de probabilidad](https://flipthecoin.app/es/blog/fundamentos-de-probabilidad/).)

## La distribución binomial

Ahora lanza una moneda justa $n$ veces y cuenta las caras. El número de caras puede ser cualquier valor entre $0$ y $n$, y las probabilidades de cada conteo forman la **distribución binomial**: la distribución de "cuántos éxitos hay en $n$ pruebas independientes de sí/no".

Para una moneda justa, su fórmula es:

$$P(k \text{ caras en } n \text{ lanzamientos}) = \binom{n}{k}\left(\tfrac{1}{2}\right)^{n}$$

y, de forma más general, cuando "cara" tiene probabilidad $p$ (no necesariamente un medio):

$$P(k) = \binom{n}{k}\, p^{k} (1-p)^{n-k}$$

Lo interesante es la **forma**. Los resultados extremos —todo caras o todo cruces— son raros, porque solo hay _una_ manera de obtener cada uno. Los resultados intermedios son frecuentes, porque hay _muchas_ ordenaciones distintas que caen ahí. Si dibujas las probabilidades obtienes una joroba alta en el centro y fina en los bordes: el comienzo de la famosa **campana de Gauss**.

Por qué aparecen exactamente esos conteos $\binom{n}{k}$ —y por qué son las filas del triángulo de Tartaglia— es una historia en sí misma, contada en [¿Qué tienen en común el triángulo de Tartaglia y una moneda?](https://flipthecoin.app/es/blog/triangulo-de-tartaglia-combinatoria-y-probabilidad/). Aquí solo necesitamos la conclusión: **suma suficientes elecciones justas e independientes y los resultados se acumulan formando una campana.**

## ¿Quién fue Francis Galton?

La forma más encantadora de _ver_ una distribución binomial la ideó **Sir Francis Galton** (1822–1911), un inquieto erudito victoriano y pariente de Charles Darwin (compartían abuelo, Erasmus Darwin). De joven exploró el suroeste de África y luego dedicó el resto de su vida a medir y contar casi todo lo que podía: el tiempo atmosférico (dibujó el primer mapa meteorológico de un periódico), las huellas dactilares e incluso la supuesta "eficacia" de la oración. Por el camino fue pionero de ideas estadísticas que seguimos usando a diario, como la **correlación** y la **regresión a la media**.

Para demostrar cómo el orden surge del azar, Galton construyó un aparato que llamó **quincunce**; hoy lo llamamos **tablero de Galton**. Deja caer una bola en una red triangular de clavijas. En cada clavija rebota a izquierda o derecha, más o menos al azar, exactamente como un lanzamiento de moneda. Tras muchas filas de clavijas, cada bola cae en una casilla del fondo. Una sola bola es impredecible. Pero vierte cientos y las casillas se llenan formando la inconfundible campana de la distribución binomial. Galton había convertido una fórmula abstracta en algo que puedes observar con tus propios ojos.

## Míralo suceder

Pulsa **Dejar caer bolas** y observa cómo crece el montón. Cada bola es un pequeño experimento; las pilas que se elevan son la distribución dibujándose a sí misma. Pulsa **Reiniciar** para empezar de nuevo.

::galton-board
::

Fíjate en que ninguna bola "sabe" a dónde debería ir y, sin embargo, el conjunto traza con fiabilidad la misma campana una y otra vez. Esa es la tranquila magia de las distribuciones de probabilidad: los sucesos individuales siguen siendo impredecibles, pero su comportamiento _colectivo_ es notablemente ordenado.

Entonces, ¿cómo se conecta esto con una sola moneda? **Cada rebote a izquierda o derecha del tablero es un lanzamiento de moneda**, y cada bola que llega al fondo es un experimento completo de varios lanzamientos, que cae en la casilla correspondiente a cuántas veces salió "cara". Por eso un único lanzamiento nunca puede revelar una curva: una curva es un patrón que vive en _muchos_ resultados, no en uno. Lanza una vez y simplemente obtienes cara o cruz. Lanza una y otra vez, lleva la cuenta, y esos recuentos van trazando poco a poco la misma campana que ves arriba.

[Lanza una moneda online](https://flipthecoin.app/es/play/) y observa cómo crece tu propio historial de lanzamientos: la distribución solo toma forma cuando los lanzamientos se acumulan, igual que las bolas.
