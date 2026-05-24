---
title: Cómo lanzamos una moneda en FlipTheCoin.app
slug: como-lanzamos-una-moneda
_locale: es
description: Un paseo en lenguaje llano por la física de cada lanzamiento de moneda en FlipTheCoin.app — el empujón, el giro y la gravedad que decide cara o cruz.
published: true
date: 2026-04-23T01:00:00Z
---

# Cómo lanzamos una moneda en FlipTheCoin.app

Las matemáticas detrás de un lanzamiento de moneda son simples: una moneda tiene dos caras, cara y cruz, y cada cara tiene la misma probabilidad de quedar hacia arriba. Pero, ¿cómo lanzamos una moneda de verdad? En este artículo exploraremos la ciencia detrás de los lanzamientos y cómo nos aseguramos de que cada uno sea justo y aleatorio.

<!--more-->

Se te perdonaría pensar que un lanzamiento de moneda en un navegador no es más que `Math.random()` disfrazado de animación bonita. Es una forma de hacerlo — y de hecho ofrecemos ese modo en el [motor de lanzamiento](https://flipthecoin.app/toss-engine) si quieres un 50/50 limpio sin dramas.

Pero la moneda que ves en la portada y en nuestra extensión del navegador no es "un número aleatorio disfrazado". Es una pequeña simulación física real: un disco, un suelo, gravedad y un empujón. La cara que acaba mirando al techo gana. Vamos a ver qué significa eso.

## ¿Por qué simular la física?

Dos razones:

1. **Es más divertido de mirar.** Una moneda lanzada, girando y rebotando parece una moneda. Una escena que dice "CARA" no lo parece.
2. **Refleja cómo funcionan los lanzamientos reales.** En el mundo real, un lanzamiento de moneda no es matemáticamente aleatorio — es un proceso físico determinista que es sensible a las diferencias minúsculas en cómo lo lanzas. Nuestra simulación tiene el mismo carácter: la aleatoriedad vive enteramente en _cómo la lanzamos_, y el resto es física.

Si quieres un 50/50 matemáticamente limpio (y nunca un "canto"), usa el [motor de lanzamiento](https://flipthecoin.app/toss-engine). Si quieres la sensación real, sigue leyendo.

## Los tres ingredientes de un lanzamiento

Cada vez que haces clic en la moneda, le damos tres cosas: un empujón hacia arriba, una pequeña deriva lateral y un giro.

### 1. Un empujón hacia arriba

Primero la empujamos hacia el aire. En nuestra simulación ese empujón es un valor fijo — unas 9 unidades de velocidad vertical — idéntico cada vez. Esto marca cuánto tiempo la moneda permanece en el aire. No es aleatorio; solo la altura suficiente para un buen tumbo.

### 2. Una inclinación lateral consistente con algo de variación

Si cada lanzamiento saliera del mismo punto y aterrizara en el mismo sitio, la moneda se apilaría como una pila de tortitas. Así que también le damos un empujón lateral en los dos ejes horizontales — mayormente un valor fijo, con una pequeña adición aleatoria cada vez. Es la misma dirección general en cada lanzamiento (para que la moneda no salga volando — al menos no demasiado), pero el punto exacto de aterrizaje varía.

Aquí es donde nace la aleatoriedad en nuestra simulación: introducimos un valor "semilla" que determina la dirección exacta del empujón lateral.

### 3. Un giro

Esta es la parte que realmente decide el resultado. En el modo puramente aleatorio aplicamos una **velocidad angular aleatoria** entre −10 y +10 en dos de los tres ejes de rotación — números aleatorios frescos en cada lanzamiento. En palabras llanas: le estamos diciendo a la moneda _a qué velocidad y en qué dirección rodar_.

Dejamos el tercer eje de rotación a cero a propósito: mantiene el movimiento legible en lugar de dejar que la moneda se bambolee caóticamente en todas las direcciones posibles a la vez.

Una vez fijados esos tres valores, soltamos. A partir de ahí, todo es física.

## La gravedad hace el resto

La moneda vive en un mundo simulado en miniatura donde la gravedad es **9,82 m/s²** — la misma atracción que sentirías en la Tierra. Sube, frena, cae, golpea el suelo, rebota un poco y finalmente se asienta.

Importante: no miramos el resultado por adelantado. No decidimos previamente "esta saldrá cara". La simulación corre, la moneda hace lo suyo, y lo que esté haciendo cuando se detiene es lo que llamamos el resultado. En ese sentido, es exactamente como un lanzamiento real: el momento en que la moneda deja tu pulgar, el resultado ya está decidido en principio, pero nadie lo sabe hasta que aterriza.

## Cómo leemos el resultado

Una vez que la moneda deja de moverse, necesitamos responder: "¿qué cara está mirando al techo?"

El truco es tomar una flecha virtual que apunte justo _hacia arriba desde la cara superior de la moneda_, y ver hacia dónde acaba apuntando después de todo ese giro:

- Si la flecha apunta más o menos **hacia arriba** — la cara superior mira al cielo — es **cara**.
- Si apunta más o menos **hacia abajo** — la cara superior ahora está boca abajo en el suelo — es **cruz**.
- Si apunta más o menos **de lado** — la moneda ha quedado apoyada sobre su canto — es **canto**.

Ese último es el raro "canto" mencionado en el [artículo de estadísticas](https://flipthecoin.app/es/blog/la-estadistica-inesperada-de-los-lanzamientos-de-moneda) — la moneda equilibrada sobre su borde — y ocurre en la simulación por la misma razón que ocurre en la vida real: a veces el tumbo simplemente sale así. Si tienes curiosidad por saber por qué llamarlo "edge case" es un gran juego de palabras, escribí sobre ello [aquí](https://flipthecoin.app/es/blog/de-donde-viene-el-termino-edge-case).

## ¿Entonces es realmente aleatorio?

Más o menos — con una nota al pie.

La aleatoriedad en nuestro lanzamiento viene de la deriva lateral aleatoria y del giro aleatorio que le damos a la moneda al lanzar. Bajo el capó, esos números vienen de `Math.random()` de JavaScript. La física posterior es completamente determinista: mismas entradas, mismo resultado, siempre. Así que la simulación hereda la calidad de aleatoriedad que proporcione `Math.random()`, repartida entre tres valores con semilla.

¿Es eso aleatoriedad "verdadera"? No — es pseudoaleatoria, como la mayoría de la aleatoriedad en un ordenador. ¿Es aleatoria _lo suficiente_ como para que no puedas trucarla haciendo clic de una forma concreta? Por supuesto. Y resulta que esto también es cierto para los lanzamientos reales: [la investigación ha demostrado](https://arxiv.org/abs/2310.04153) que los lanzamientos reales están ligeramente sesgados hacia la cara con la que empezaron, lo que significa que un lanzamiento simulado es, irónicamente, un poco _más_ justo que el real.

> Un lanzamiento simulado es, irónicamente, un poco _más_ justo que el real

## Conclusión

Así que la próxima vez que lances una moneda en el sitio, esto es lo que pasa en realidad: un lanzamiento de tres números (empujón, deriva, giro), una breve simulación física y una lectura de hacia dónde apunta la cara superior de la moneda cuando se detiene. Sin trucos, sin ganador preseleccionado. Solo un mundo muy pequeño con una gravedad muy normal.

¿Con curiosidad por las matemáticas de fondo? Empieza por [Fundamentos de probabilidad](https://flipthecoin.app/es/blog/fundamentos-de-probabilidad). ¿Con curiosidad por la rarísima realidad estadística de los lanzamientos reales? [La estadística inesperada de los lanzamientos de moneda](https://flipthecoin.app/es/blog/la-estadistica-inesperada-de-los-lanzamientos-de-moneda) es el que buscas.

¿Listo para ver la física en acción? [Lanza una moneda online](https://flipthecoin.app/es/play) ahora mismo.
