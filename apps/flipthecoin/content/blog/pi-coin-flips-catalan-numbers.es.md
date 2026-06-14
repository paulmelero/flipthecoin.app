---
title: Lanzando una moneda hasta que obtenemos PI
slug: lanzando-una-moneda-hasta-obtener-pi
series: random-walks
seriesOrder: 3
_locale: es
description: Descubre cómo lanzar una moneda hasta que haya más caras que cruces
  conduce, inesperadamente, al número π — a través de los números de Catalan y
  la serie del arcoseno.
published: true
level: advanced
date: 2026-05-27T10:00:00Z
tags:
  - pi
  - moneda justa
  - números de Catalan
  - triángulo de Tartaglia
---

# Lanzando una moneda hasta que obtenemos PI

Matt Parker, del canal [Stand-up Maths](https://www.youtube.com/@standupmaths), publicó recientemente [un vídeo](https://www.youtube.com/watch?v=kahGSss6SsU) con una premisa tan simple de enunciar como difícil de creer: si lanzamos una moneda repetidamente hasta que haya más caras que cruces, y calculamos la proporción media de caras respecto al total de lanzamientos... el resultado es $\frac{\pi}{4}$.

Sí, $\pi$. _El número de los círculos_. Escondido dentro de lanzamientos de moneda.

En nuestro [artículo anterior sobre el triángulo de Tartaglia](https://flipthecoin.app/es/blog/triangulo-de-tartaglia-combinatoria-y-probabilidad/) vimos cómo un triángulo de sumas sencillas contenía, en su interior, la combinatoria, el álgebra y la probabilidad. Hoy vamos a tirar del mismo hilo. Y nos va a llevar a un lugar que nadie esperaba.

<!--more-->

Las reglas del experimento son sencillas:

1. Lanzamos una moneda justa repetidamente.
2. Nos detenemos **en el momento exacto** en que el número de caras supera al de cruces.
3. Anotamos la **proporción de caras** respecto al total de lanzamientos de esa secuencia.

La pregunta del artículo será: si repetimos este proceso infinitas veces y calculamos la media de todas esas proporciones... ¿qué obtenemos?

Antes de responder, pensemos en qué rango puede moverse esa proporción. En el mejor de los casos, el primer lanzamiento es cara: paramos inmediatamente y la proporción es $\frac{1}{1} = 1$ (el 100 % son caras). En el peor, necesitamos miles de lanzamientos hasta que las caras superen a las cruces por uno, y la proporción será apenas superior a $\frac{1}{2}$. Así que la media estará en algún punto entre $0{,}5$ y $1$. Veamos exactamente dónde.

## Construyendo las secuencias, paso a paso

Vamos a construir las secuencias posibles empezando por las más cortas. Usaremos **O** para cara y **X** para cruz — la misma notación que usamos en [nuestra herramienta de lanzamiento](https://flipthecoin.app/es/play/).

### Longitud 1

La secuencia más corta posible: lanzamos una vez y sale cara.

$$\textbf{O}$$

Paramos. Tenemos 1 cara y 0 cruces. La proporción es $\frac{1}{1} = 1$ y la probabilidad de que esto ocurra es $\frac{1}{2}$.

### Longitud 3

Si el primer lanzamiento es cruz, no podemos parar. Y con sólo dos lanzamientos, lo mejor que podemos lograr es empatar (1 cara, 1 cruz) — empatar no basta, necesitamos que las caras _superen_ a las cruces. Así que la siguiente secuencia posible tiene longitud 3:

$$\textbf{X O O}$$

Cruz, cara, cara. El tercer lanzamiento nos da 2 caras frente a 1 cruz. Proporción: $\frac{2}{3}$ (2 caras de 3 lanzamientos). Probabilidad: $\left(\frac{1}{2}\right)^3 = \frac{1}{8}$. Y es la única secuencia posible de esta longitud.

### Longitud 5

Aquí se pone interesante. Necesitamos 3 caras y 2 cruces, y el quinto lanzamiento (el que nos detiene) tiene que ser cara. Además — y esto es clave — **en ningún momento antes del final podemos haber tenido más caras que cruces**, porque si eso hubiera ocurrido, nos habríamos detenido antes.

No basta con que la secuencia termine con más caras que cruces; tiene que ser **la primera vez** que ocurre.

¿Cuántas secuencias cumplen estas condiciones? Sólo dos:

```text
X X O O O
X O X O O
```

Comprobemos la primera: **XXOOO**. Si contamos O como $+1$ y X como $-1$, las sumas parciales son:

$$-1,\; -2,\; -1,\; 0,\; +1$$

Nunca supera el cero hasta el quinto lanzamiento. ✅

Ahora la segunda: **XOXOO**.

$$-1,\; 0,\; -1,\; 0,\; +1$$

Vuelve a cero en el segundo y cuarto lanzamiento, pero nunca lo supera. Es la primera vez que llega a $+1$. ✅

¿Y qué pasa con **OXXOO**? Veamos: $+1, 0, -1, 0, +1$. El primer lanzamiento ya nos pone en $+1$: nos habríamos detenido ahí. No es válida. ❌

Así que hay exactamente **2 secuencias** de longitud 5, cada una con probabilidad $\left(\frac{1}{2}\right)^5 = \frac{1}{32}$ y proporción $\frac{3}{5}$ (3 caras de 5 lanzamientos).

### Longitud 7

El mismo razonamiento se aplica a secuencias de longitud 7 (4 caras, 3 cruces). Si las enumeramos todas — y créeme, lleva un rato — encontramos exactamente **5 secuencias** válidas.

### La tabla resumen

| Longitud ($2n+1$) | Proporción de caras | Secuencias válidas | Probabilidad de cada una |
| :---------------: | :-----------------: | :----------------: | :----------------------: |
|     1 ($n=0$)     |    $\frac{1}{1}$    |         1          |      $\frac{1}{2}$       |
|     3 ($n=1$)     |    $\frac{2}{3}$    |         1          |      $\frac{1}{8}$       |
|     5 ($n=2$)     |    $\frac{3}{5}$    |         2          |      $\frac{1}{32}$      |
|     7 ($n=3$)     |    $\frac{4}{7}$    |         5          |     $\frac{1}{128}$      |
|     9 ($n=4$)     |    $\frac{5}{9}$    |         14         |     $\frac{1}{512}$      |

Observa los patrones:

- La longitud siempre es impar: $2n + 1$.
- La proporción de caras es siempre $\frac{n+1}{2n+1}$.
- La probabilidad de cada secuencia individual es $\left(\frac{1}{2}\right)^{2n+1}$ — cada uno de los $2n+1$ lanzamientos tiene una probabilidad de un medio.

Pero la columna que realmente importa es la de las secuencias válidas: $1, 1, 2, 5, 14, \ldots$

¿Te suena?

## Del conteo manual a los números de Catalan

Esos números — $1, 1, 2, 5, 14, 42, 132, \ldots$ — tienen nombre propio. Son los [**números de Catalan**](https://es.wikipedia.org/wiki/N%C3%BAmeros_de_Catalan), una de las secuencias más ubicuas de toda la combinatoria. (Y no, no son de origen _Catalán_.)

Su historia es en sí misma una historia de conexiones inesperadas. El matemático mongol [**Mingantu**](https://es.wikipedia.org/wiki/Minggatu) (c. 1692–1763), trabajando en China, fue la primera persona conocida en utilizarlos — alrededor de la década de 1730, en series trigonométricas incluidas en su libro _Ge Yuan Mi Lu Jie Fa_. Dos décadas más tarde, en 1751, **Leonhard Euler** [descubrió la misma secuencia de forma independiente](https://es.wikipedia.org/wiki/N%C3%BAmeros_de_Catalan#Historia) en una carta a Goldbach, esta vez contando las formas de dividir un polígono en triángulos. Y casi un siglo después de Mingantu, el matemático franco-belga **Eugène Charles Catalan** (1814–1894) los encontró de nuevo en 1838, al contar las formas de colocar paréntesis en un producto de factores. La secuencia lleva su nombre — acuñado por John Riordan en el siglo XX — a pesar de que los números habían estado apareciendo, bajo diferentes formas, durante más de cien años antes que él.

La misma secuencia, descubierta de forma independiente en tres partes del mundo y a lo largo de tres siglos, cada vez en un contexto completamente distinto. Si ese patrón te suena familiar... sigue leyendo.

El $n$-ésimo número de Catalan se define como:

$$C_n = \frac{1}{n+1}\binom{2n}{n}$$

donde $\binom{2n}{n}$ — se lee «$2n$ sobre $n$» — es el **coeficiente binomial**: el número de formas de elegir $n$ elementos de un conjunto de $2n$. En la práctica, responde a preguntas como «¿de cuántas formas puedo distribuir $n$ caras en $2n$ lanzamientos?» Exploramos esta notación en detalle en el [artículo sobre el triángulo de Tartaglia](https://flipthecoin.app/es/blog/triangulo-de-tartaglia-combinatoria-y-probabilidad/).

Comprobemos con nuestros datos:

$$C_0 = \frac{1}{1}\binom{0}{0} = 1 \qquad C_1 = \frac{1}{2}\binom{2}{1} = 1$$

$$C_2 = \frac{1}{3}\binom{4}{2} = 2 \qquad C_3 = \frac{1}{4}\binom{6}{3} = 5 $$

$$C_4 = \frac{1}{5}\binom{8}{4} = 14$$

Exacto. Los números de Catalan cuentan precisamente cuántas secuencias de lanzamientos terminan **por primera vez** con más caras que cruces en cada longitud posible.

## La conexión con el triángulo de Tartaglia

Hay otra forma de ver por qué aparecen los números de Catalan aquí. Pensemos en cada secuencia de lanzamientos como un **camino** en una retícula: cara sube un paso, cruz baja un paso. El número total de caminos de longitud $2n+1$ que terminan un paso por encima de cero es el coeficiente binomial $\binom{2n+1}{n+1}$ — una entrada del triángulo de Tartaglia. Los números de Catalan cuentan sólo los caminos que nunca cruzan por encima de cero antes del paso final. Son, literalmente, una selección filtrada dentro del triángulo — la misma herramienta que usamos en el [artículo anterior](https://flipthecoin.app/es/blog/triangulo-de-tartaglia-combinatoria-y-probabilidad/) para contar combinaciones de monedas, ahora con una restricción adicional. Si quieres explorar esta conexión en más detalle, Matt Parker la explica de forma brillante en [su vídeo](https://www.youtube.com/watch?v=kahGSss6SsU).

## La serie infinita

Volvamos a nuestra tabla. La contribución de las secuencias de longitud $2n+1$ al promedio total es:

$$\underbrace{\left(\frac{1}{2}\right)^{2n+1}}_{\text{probabilidad}} \times \underbrace{C_n}_{\text{n.º de secuencias}} \times \underbrace{\frac{n+1}{2n+1}}_{\text{proporción de caras}}$$

Y la proporción media global es la suma de **todas** estas contribuciones, desde $n = 0$ hasta el infinito:

$$\text{Media} = \sum_{n=0}^{\infty} \frac{C_n}{2^{2n+1}} \cdot \frac{n+1}{2n+1}$$

Calculemos los primeros términos:

| $n$ | Contribución                                                  | Acumulado  |
| :-: | :------------------------------------------------------------ | :--------- |
|  0  | $\frac{1}{2} \times 1 \times 1 = 0{,}5$                       | $0{,}5000$ |
|  1  | $\frac{1}{8} \times 1 \times \frac{2}{3} \approx 0{,}0833$    | $0{,}5833$ |
|  2  | $\frac{1}{32} \times 2 \times \frac{3}{5} = 0{,}0375$         | $0{,}6208$ |
|  3  | $\frac{1}{128} \times 5 \times \frac{4}{7} \approx 0{,}0223$  | $0{,}6431$ |
|  4  | $\frac{1}{512} \times 14 \times \frac{5}{9} \approx 0{,}0152$ | $0{,}6583$ |

Con sólo cinco términos ya estamos en $0{,}6583$, acercándonos lentamente a $\frac{\pi}{4} \approx 0{,}7854$. La convergencia es lenta, pero la dirección es inequívoca cuando el número de lanzamientos es suficientemente grande.

## La aparición del arcoseno

Aquí es donde ocurre la magia. Sustituyamos la fórmula de los números de Catalan en nuestra serie:

$$C_n = \frac{1}{n+1}\binom{2n}{n}$$

Al multiplicar $C_n$ por $\frac{n+1}{2n+1}$, el factor $(n+1)$ se cancela limpiamente:

$$\frac{1}{n+1}\binom{2n}{n} \cdot \frac{n+1}{2n+1} = \frac{\binom{2n}{n}}{2n+1}$$

Y la serie queda:

$$\text{Media} = \sum_{n=0}^{\infty} \frac{\binom{2n}{n}}{2^{2n+1}(2n+1)} = \frac{1}{2} \sum_{n=0}^{\infty} \frac{\binom{2n}{n}}{4^n(2n+1)}$$

Ahora viene el momento que a Matt Parker le hace «enfadar de pura incredulidad». Resulta que existe una función clásica del análisis matemático llamada **arcoseno** — la función inversa del seno — cuya expansión en serie de potencias es:

$$\arcsin(x) = \sum_{n=0}^{\infty} \frac{\binom{2n}{n}}{4^n} \cdot \frac{x^{2n+1}}{2n+1}$$

¿Te parece familiar? Es exactamente nuestra serie, multiplicada por $2$ y con $x$ en lugar de $1$.

Si evaluamos en $x = 1$:

$$\arcsin(1) = \sum_{n=0}^{\infty} \frac{\binom{2n}{n}}{4^n(2n+1)}$$

¿Y cuánto vale $\arcsin(1)$? Es el ángulo cuyo seno es $1$, es decir, $90°$:

$$\arcsin(1) = \frac{\pi}{2}$$

Por lo tanto:

$$\text{Media} = \frac{1}{2} \cdot \frac{\pi}{2} = \frac{\pi}{4}$$

Esta conexión fue [descubierta en 2025 por el matemático **Jim Propp**](https://arxiv.org/abs/2602.14487). Y lo que la hace extraordinaria no es que $\pi$ aparezca en una serie infinita — eso es habitual. Lo extraordinario es que una serie nacida de un proceso tan elemental como lanzar monedas resulte ser _exactamente_ la misma serie que define una función trigonométrica.

No es una aproximación ni una coincidencia numérica — es una identidad matemática exacta.

Eso sí, no intentes calcular $\pi$ de esta forma. Como el propio Propp [explicó en el propio documento de Arxiv](https://arxiv.org/abs/2602.14487):

> Para obtener pi con la precisión de 3,14, podrían hacer falta hasta un billón de lanzamientos de moneda. En parte porque las secuencias pueden alargarse mucho antes de que las caras superen a las cruces — tanto que el valor esperado de la longitud de una secuencia es ¡infinito! Además, no se pueden lanzar todas las monedas a la vez como se pueden soltar agujas: el orden de caras y cruces importa.

## Reflexión final

En el artículo anterior, descubrimos que el triángulo de Tartaglia conectaba la combinatoria, el álgebra y la probabilidad. Tres lenguajes que contaban la misma historia.

Hoy hemos añadido un cuarto personaje a la trama: el número $\pi$.

Lanzar una moneda parece un proceso puramente aleatorio. El triángulo de Tartaglia parece pura aritmética. Los números de Catalan parecen un capricho de la combinatoria. Y $\pi$ parece pertenecer exclusivamente a la geometría — a los círculos, a las curvas, al mundo continuo.

Y sin embargo, todos terminan conectados en una sola ecuación.

Hay algo profundamente satisfactorio en descubrir que un hecho nuevo sobre $\pi$ se escondía, desde siempre, detrás de algo tan mundano como lanzar una moneda. Y que nadie lo notó hasta 2025.

Las matemáticas siguen teniendo secretos. Y a veces, están más cerca de lo que pensamos.

Pon la teoría en práctica: [lanza una moneda online](https://flipthecoin.app/es/play/) y observa los patrones en acción.
