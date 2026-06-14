---
title: ¿De dónde viene el término "edge case"?
slug: de-donde-viene-el-termino-edge-case
_locale: es
description: '"Edge case" en software no tiene nada que ver con una moneda cayendo sobre su canto — pero en una app de lanzar monedas, los dos significados se cruzan.'
published: true
level: beginner
date: 2026-04-23T01:00:00Z
---

# ¿De dónde viene el término "edge case"?

Te ha caído una moneda sobre su canto? Has tenido una moneda en tus manos y te has preguntado por qué se llama "canto" y no "borde"? ¿O has oído el término "edge case" y te has preguntado de dónde viene?

Está el **borde literal** de una moneda: el fino canto entre cara y cruz. Que una moneda real caiga sobre ese canto es un suceso raro, alrededor de [1 entre 6000 lanzamientos](https://flipthecoin.app/es/blog/la-estadistica-inesperada-de-los-lanzamientos-de-moneda), y sí, nuestra simulación también lo contempla. Y luego está el **"edge case" de la ingeniería de software**: el término que usan los desarrolladores para entradas raras, extremas, en los límites, que las pruebas cotidianas no detectan.

¿Están relacionados los dos?

**Respuesta corta**: no. El "edge" en "edge case" no tiene nada que ver con el canto de las monedas. Pero el hecho de que una app de lanzar monedas tenga que manejar ambos — un canto literal y un _edge case_ — es una coincidencia que no puedo dejar pasar. Así que aquí va la historia.

<!--more-->

## Qué quieren decir los ingenieros con "edge case"

En software (y más ampliamente, en ingeniería), un **edge case** es una entrada o estado que está en el extremo del límite de lo que un sistema está diseñado para manejar. Cosas como:

- Una lista vacía, cuando la mayoría de las listas tienen elementos.
- Un número en el valor máximo permitido — el entero más grande, el año más alto que tu selector de fechas acepta.
- Exactamente medianoche en un día bisiesto.
- Un usuario sin nombre, o un nombre hecho enteramente de emoji. _¡Hola, 🪙🐬!_

Estos casos rara vez aparecen en el uso normal, pero es donde los sistemas fallan silenciosamente. Algunos trabajos te entrenan a buscarlos de la misma forma en que los humanos somos muy buenos detectando patrones en general.

## El borde, la esquina y el límite

Tres términos muy emparentados se usan para ideas similares, y la gente los intercambia sin pensar. El [artículo de Wikipedia sobre corner cases](https://en.wikipedia.org/wiki/Corner_case) tiene la distinción más limpia:

- Un **edge case** empuja **una** variable a su mínimo o máximo. Unidimensional.
- Un **corner case** empuja **varias** variables a sus extremos _al mismo tiempo_. Piensa en una caja n-dimensional: las esquinas son donde varios bordes se encuentran. El ejemplo de Wikipedia es bueno — un altavoz que solo falla cuando el volumen está al máximo _y_ los graves están al máximo _y_ la humedad es alta. Cada mando está bien por sí solo; la esquina es donde se cruzan.
- Un **boundary case** está justo en el umbral entre dos comportamientos — como 17 vs 18 en una comprobación de mayoría de edad.

En conversaciones informales nadie se molesta con la distinción. Verás "edge case" usado para los tres, y está bien. El lenguaje va a la deriva, y todo el mundo sigue entendiendo lo que quieres decir.

## De dónde viene realmente la palabra

El término no viene del software en absoluto. Viene de **la ingeniería hardware** — en concreto, de las pruebas de componentes electrónicos y sistemas complejos.

Cuando diseñas un circuito, un chip, o en realidad cualquier sistema físico, el componente está calificado para funcionar en un **rango** de condiciones operativas: un rango de voltaje, un rango de temperatura, un rango de frecuencia, un rango de presión. Probar significa que no solo compruebas el medio de cada rango; compruebas los extremos, porque ahí es donde los componentes se rompen primero. Esos extremos son los **bordes de la envolvente operativa**.

La metáfora misma toma prestado de la [envolvente de vuelo](https://en.wikipedia.org/wiki/Flight_envelope) de la aeronáutica — la región de velocidades y altitudes en la que un avión puede operar con seguridad. El "borde de la envolvente" es jerga de pilotos e ingenieros para los límites exteriores de esa región. "Edge case" es la versión de pruebas de la misma idea: condiciones justo contra la pared donde las cosas empiezan a romperse.

El software heredó el lenguaje cuando la ingeniería informática creció a partir de la ingeniería eléctrica. La metáfora se quedó porque seguía siendo útil: cada sistema tiene una forma, y cada forma tiene bordes.

## ¿Y qué pasa con la moneda?

Aquí está la parte divertida. En **nuestra** app, el "canto" literal de una moneda — el fino borde sobre el que a veces cae — es _también_ un edge case en el sentido software:

- Está en el **extremo** del espacio de resultados posibles. La mayoría de lanzamientos caen sólidamente en cara o cruz; solo una fracción mínima de todos los estados físicos posibles resulta en "canto".
- Nuestro código tiene que manejarlo específicamente. Una vez que la física se estabiliza, comprobamos cómo de cerca está la parte superior de la moneda de apuntar de lado, y si está dentro de un pequeño umbral lo llamamos "Canto". (Si tienes curiosidad por esa comprobación, escribí [cómo lanzamos una moneda](https://flipthecoin.app/es/blog/como-lanzamos-una-moneda), que incluye los detalles.)

Así que aunque la _palabra_ "edge" en "edge case" no tiene nada que ver con cantos de moneda, en nuestro pequeño rincón del universo los dos significados se han fundido calladamente. El raro canto físico de la moneda es el raro edge case que tenemos que programar.

Este es el tipo de etimología accidental que me parece deliciosa. Dos términos no relacionados nacidos en campos diferentes, ambos significando "el extremo raro en el límite", chocando perfectamente dentro de una única app.

¿Habría sido más ordenado si "edge case" _viniera_ de las monedas? Sí. Pero entonces no tendríamos la coincidencia, y yo no habría escrito este artículo.

## Conclusión

"Edge case" viene de algún otro campo de la ingeniería, no de la estadística. Pero en una app de lanzar monedas, el borde es las dos cosas.

Hablando de bordes — [lanza una moneda online](https://flipthecoin.app/es/play) y a ver si consigues que caiga en el canto.
