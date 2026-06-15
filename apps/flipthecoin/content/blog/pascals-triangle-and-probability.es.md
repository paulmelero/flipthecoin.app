---
title: ¿Qué tienen en común el triángulo de Tartaglia y una moneda?
slug: triangulo-de-tartaglia-combinatoria-y-probabilidad
series: random-walks
seriesOrder: 1
_locale: es
description: Descubre cómo el triángulo de Tartaglia conecta la combinatoria, el
  álgebra y la probabilidad — explicado paso a paso con lanzamientos de moneda.
published: true
level: intermediate
date: 2026-05-24T10:00:00Z
tags:
  - triángulo de Tartaglia
  - curva de campana
  - Omar Jayyam
  - Jia Xian
  - Niccolò Fontana Tartaglia
---

# ¿Qué tienen en común el triángulo de Tartaglia y una moneda?

Existe un triángulo de números que lleva siglos fascinando a matemáticos y matemáticas de todo el mundo. Su construcción es tan sencilla que un niño o niña podría dibujarlo en un cuaderno. Y sin embargo, dentro de sus filas se esconde una conexión profunda entre tres ramas de las matemáticas que, a primera vista, no parecen tener nada que ver entre sí: la :term[combinatoria]{slug="combinatoria"}, el álgebra y la probabilidad. Lo más sorprendente es que esa conexión se revela con algo tan cotidiano como lanzar una moneda.

<!--more-->

## Un poco de historia

En muchos países de habla hispana este patrón se conoce como **triángulo de Tartaglia**, en honor al matemático italiano Niccolò Fontana Tartaglia (1499–1557), que lo estudió en el contexto de la resolución de ecuaciones cúbicas. En el mundo anglosajón se le llama **triángulo de Pascal**, porque Blaise Pascal publicó en 1654 un tratado — el _Traité du triangle arithmétique_ — donde formalizó sus propiedades y, lo que es más importante, lo conectó por primera vez con los problemas de azar que le planteaba el caballero de Méré.

Pero la historia real de este triángulo es mucho más antigua. En la China del siglo XI, el matemático Jia Xian ya describía el mismo patrón para calcular coeficientes de potencias. Más tarde, en el siglo XIII, Yang Hui lo reprodujo en un diagrama que ha llegado hasta nuestros días. En Persia, Omar Jayyam trabajó con las mismas ideas en el siglo XII. Y en la India, Pingala exploró patrones combinatorios similares siglos antes de nuestra era.

Que civilizaciones tan distantes en el tiempo y el espacio descubrieran el mismo triángulo de forma independiente nos dice algo importante: no se trata de una invención humana arbitraria, sino de una estructura que emerge de forma natural cada vez que alguien se pregunta _¿de cuántas maneras puedo organizar esto?_

## Cómo construir el triángulo

La regla de construcción es elegantemente simple:

1. Empieza colocando un **1** en la cima.
2. En cada fila nueva, coloca un **1** en cada extremo.
3. Cada número interior es la **suma de los dos números** que tiene justo encima.

Las primeras filas quedan así:

```text
            1
          1   1
        1   2   1
      1   3   3   1
    1   4   6   4   1
  1   5  10  10   5   1
```

La primera fila (el **1** solitario de la cima) se llama **fila 0**. La siguiente es la fila 1, y así sucesivamente. Esto no es un capricho: numerar desde cero hará que todo encaje mejor cuando conectemos el triángulo con las fórmulas.

Fíjate en la fila 4: $1, 4, 6, 4, 1$. El $6$ del centro viene de sumar los dos números que tiene encima: $3 + 3$. El $4$ de la izquierda viene de $1 + 3$. Siempre la misma regla.

### Los coeficientes binomiales

Cada número del triángulo tiene un nombre formal: es un :term[coeficiente binomial]{slug="coeficiente-binomial"}. Se escribe así:

$$\binom{n}{k}$$

y se lee "**$n$ sobre $k$**". Su significado es directo: representa el número de formas de elegir $k$ elementos de un conjunto de $n$, sin importar el orden.

Por ejemplo, $\binom{4}{2} = 6$ significa que hay 6 formas de elegir 2 objetos de entre 4. Y efectivamente, si miras la fila 4 del triángulo, la posición 2 (contando desde 0) es precisamente $6$.

La fórmula para calcularlo es:

$$\binom{n}{k} = \frac{n!}{k! \cdot (n-k)!}$$

Aquí, el símbolo $n!$ se llama **factorial** y significa multiplicar todos los números enteros desde $1$ hasta $n$. Por ejemplo, $4! = 4 \times 3 \times 2 \times 1 = 24$. Por convención, $0! = 1$.

Comprobemos: $\binom{4}{2} = \frac{4!}{2! \cdot 2!} = \frac{24}{2 \times 2} = \frac{24}{4} = 6$. Correcto.

Así, la fila $n$ del triángulo contiene los valores:

$$\binom{n}{0},\; \binom{n}{1},\; \binom{n}{2},\; \ldots,\; \binom{n}{n}$$

## La combinatoria: el arte de contar sin enumerar

La **combinatoria** es la rama de las matemáticas que estudia cuántas maneras distintas existen de organizar, agrupar o elegir elementos. Su poder reside en que nos permite conocer el número de posibilidades _sin tener que listarlas una por una_.

Para entender por qué esto es útil, pensemos en lanzar una moneda. Cada lanzamiento tiene dos resultados posibles: **cara** (O) o **cruz** (X). Si lanzamos la moneda una vez, hay $2$ resultados. Si la lanzamos dos veces, cada uno de los 2 resultados del primer lanzamiento se combina con los 2 del segundo, dando $2 \times 2 = 4$ resultados. Con tres lanzamientos, $2 \times 2 \times 2 = 8$.

Ese patrón se expresa con un :term[exponente]{slug="exponente"}:

$$2^n$$

donde $n$ es el número de lanzamientos. El exponente indica cuántas veces multiplicamos la base ($2$) por sí misma. Así:

| Lanzamientos ($n$) | Resultados posibles ($2^n$) |
| :----------------: | :-------------------------: |
|         1          |              2              |
|         2          |              4              |
|         3          |              8              |
|         5          |             32              |
|         10         |            1.024            |

Con solo 10 lanzamientos ya hay más de mil combinaciones posibles. La combinatoria nos ayuda a manejar esas cantidades sin perder la cabeza.

Si necesitas repasar qué es la probabilidad y cómo se mide, echa un vistazo a [Fundamentos de probabilidad](https://flipthecoin.app/es/blog/fundamentos-de-probabilidad/).

## Caso práctico: 3 lanzamientos

Vamos a conectar todo con un ejemplo concreto. Lanzamos una moneda 3 veces. Sabemos que hay $2^3 = 8$ resultados posibles. Aquí están todos:

```text
OOO    OOX    OXO    XOO    OXX    XOX    XXO    XXX
```

Ahora agrupemos estos resultados según el **número de caras** obtenidas:

| Caras | Combinaciones | Cantidad |
| :---: | :------------ | :------: |
|   0   | XXX           |    1     |
|   1   | OXX, XOX, XXO |    3     |
|   2   | OOX, OXO, XOO |    3     |
|   3   | OOO           |    1     |

Mira la columna de cantidades: $1, 3, 3, 1$. ¿Te suena? Es exactamente la **fila 3** del triángulo de Tartaglia.

Y no es casualidad. El número de formas de obtener exactamente $k$ caras en $n$ lanzamientos es precisamente $\binom{n}{k}$ — el coeficiente binomial que ocupa la posición $k$ en la fila $n$ del triángulo.

### La probabilidad entra en escena

La **probabilidad** de un suceso mide qué tan posible es que ocurra. Se calcula como:

$$P = \frac{\text{casos favorables}}{\text{casos posibles}}$$

Si la moneda es justa, cada uno de los 8 resultados es igual de probable. Así que la probabilidad de obtener exactamente $k$ caras en 3 lanzamientos es:

$$P(k \text{ caras}) = \frac{\binom{3}{k}}{2^3} = \frac{\binom{3}{k}}{8}$$

Calculemos cada caso:

| $k$ caras | $\binom{3}{k}$ |      Probabilidad       | Porcentaje |
| :-------: | :------------: | :---------------------: | :--------: |
|     0     |       1        | $\frac{1}{8} = 0{,}125$ |   12,5 %   |
|     1     |       3        | $\frac{3}{8} = 0{,}375$ |   37,5 %   |
|     2     |       3        | $\frac{3}{8} = 0{,}375$ |   37,5 %   |
|     3     |       1        | $\frac{1}{8} = 0{,}125$ |   12,5 %   |

Si sumamos todas las probabilidades: $0{,}125 + 0{,}375 + 0{,}375 + 0{,}125 = 1$. La suma siempre da $1$, porque entre todos los casos se cubre el 100 % de las posibilidades.

La fórmula general que acabamos de descubrir funciona para cualquier número de lanzamientos:

$$P(k \text{ caras en } n \text{ lanzamientos}) = \frac{\binom{n}{k}}{2^n}$$

## Caso práctico: 5 lanzamientos

Subamos la apuesta. Con 5 lanzamientos, la fila correspondiente del triángulo es:

$$1 \quad 5 \quad 10 \quad 10 \quad 5 \quad 1$$

y el total de resultados posibles es $2^5 = 32$.

Veamos algunos ejemplos concretos. ¿De cuántas formas podemos obtener exactamente **2 caras**? El triángulo nos dice $\binom{5}{2} = 10$. Estas son las 10 combinaciones:

```text
OOXXX   OXOXX   OXXOX   OXXXO   XOOXX
XOXOX   XOXXO   XXOOX   XXOXO   XXXOO
```

¿Y exactamente **3 caras**? También $\binom{5}{3} = 10$. El triángulo es simétrico: hay tantas formas de obtener 2 caras (y 3 cruces) como 3 caras (y 2 cruces).

La tabla completa de probabilidades:

| $k$ caras | $\binom{5}{k}$ |  Probabilidad   | Porcentaje |
| :-------: | :------------: | :-------------: | :--------: |
|     0     |       1        | $\frac{1}{32}$  |   3,1 %    |
|     1     |       5        | $\frac{5}{32}$  |   15,6 %   |
|     2     |       10       | $\frac{10}{32}$ |   31,3 %   |
|     3     |       10       | $\frac{10}{32}$ |   31,3 %   |
|     4     |       5        | $\frac{5}{32}$  |   15,6 %   |
|     5     |       1        | $\frac{1}{32}$  |   3,1 %    |

Si lo dibujamos como un histograma, la distribución tiene una forma familiar:

```text
0 caras  ▌              3,1 %
1 cara   ▌▌▌▌▌         15,6 %
2 caras  ▌▌▌▌▌▌▌▌▌▌    31,3 %
3 caras  ▌▌▌▌▌▌▌▌▌▌    31,3 %
4 caras  ▌▌▌▌▌         15,6 %
5 caras  ▌              3,1 %
```

Observa tres cosas:

1. **Simetría.** La distribución es un espejo perfecto alrededor del centro. Obtener 0 caras es tan improbable como obtener 5; obtener 1 es tan probable como obtener 4.
2. **Concentración central.** Los resultados más probables están en el centro (2 o 3 caras), mientras que los extremos (todo caras o todo cruces) son muy raros.
3. **Forma de campana.** La silueta recuerda a la famosa curva de Gauss. Esto no es accidental: a medida que aumentamos el número de lanzamientos, la distribución se aproxima cada vez más a esa curva.

Si te interesa explorar más la estadística detrás de los lanzamientos, lee [La estadística inesperada de los lanzamientos de moneda](https://flipthecoin.app/es/blog/la-estadistica-inesperada-de-los-lanzamientos-de-moneda/).

## La conexión con el álgebra: el binomio de Newton

Hasta ahora hemos hablado de triángulos y monedas. Pero hay un tercer protagonista que conecta todo: el **álgebra**. Concretamente, una expresión que quizá recuerdes del colegio:

$$(a + b)^n$$

Antes de desarrollarla, aclaremos un par de conceptos:

- Un **polinomio** es una expresión matemática formada por sumas de términos con variables elevadas a distintas potencias. Por ejemplo: $3x^2 + 2x + 1$.
- Un **binomio** es un caso particular de polinomio: tiene exactamente **dos** términos. Por ejemplo: $(a + b)$.

Elevar un binomio a una potencia significa multiplicarlo por sí mismo $n$ veces. Empecemos con los casos más sencillos:

**Potencia 2:**

$$(a + b)^2 = a^2 + 2ab + b^2$$

Los coeficientes son $1, 2, 1$ — la fila 2 del triángulo.

**Potencia 3:**

$$(a + b)^3 = a^3 + 3a^2b + 3ab^2 + b^3$$

Los coeficientes son $1, 3, 3, 1$ — la fila 3.

**Potencia 5:**

$$(a + b)^5 = a^5 + 5a^4b + 10a^3b^2 + 10a^2b^3 + 5ab^4 + b^5$$

Los coeficientes son $1, 5, 10, 10, 5, 1$ — la fila 5.

¿Ves el patrón? **Las filas del triángulo de Tartaglia son exactamente los coeficientes del desarrollo del binomio.** Esta relación se formaliza con el **teorema del binomio**:

$$(a+b)^n = \sum_{k=0}^{n} \binom{n}{k} \, a^{n-k} \, b^k$$

El símbolo $\sum$ (sigma) simplemente significa «suma todos los términos desde $k = 0$ hasta $k = n$». Cada término tiene un coeficiente binomial $\binom{n}{k}$ que viene directamente del triángulo.

### El puente entre álgebra y probabilidad

Ahora viene lo fascinante. Sustituye $a$ por la probabilidad de obtener **cara** y $b$ por la probabilidad de obtener **cruz**:

$$a = P(\text{cara}) = \frac{1}{2}, \quad b = P(\text{cruz}) = \frac{1}{2}$$

El binomio se convierte en:

$$\left(\frac{1}{2} + \frac{1}{2}\right)^n = \sum_{k=0}^{n} \binom{n}{k} \left(\frac{1}{2}\right)^{n-k} \left(\frac{1}{2}\right)^k = \sum_{k=0}^{n} \frac{\binom{n}{k}}{2^n}$$

El lado izquierdo es simplemente $1^n = 1$: la certeza total. El lado derecho es la suma de todas las probabilidades individuales. Y cada término $\frac{\binom{n}{k}}{2^n}$ es exactamente la probabilidad de obtener $k$ cruces (o equivalentemente, $n - k$ caras).

Comprobémoslo con 5 lanzamientos:

$$\frac{1 + 5 + 10 + 10 + 5 + 1}{32} = \frac{32}{32} = 1$$

Cada número de la fila 5 dividido entre $2^5$ nos da una probabilidad, y juntas suman $1$. El triángulo, la combinatoria y el álgebra no son tres historias diferentes: **son la misma historia contada en tres idiomas distintos**.

## Reflexión final

A lo largo de este artículo hemos seguido un hilo que conecta tres ramas de las matemáticas a través de un mismo objeto:

- La **combinatoria** nos dice de cuántas maneras podemos organizar un conjunto de resultados.
- El **álgebra** del binomio genera esas mismas cantidades como coeficientes de una fórmula.
- La **probabilidad** transforma esos números en predicciones sobre el mundo real.

Y el **triángulo de Tartaglia** es el objeto que las une: una tabla visual donde las tres disciplinas convergen.

Lo que empezó como un triángulo para contar combinaciones — dibujado en la China del siglo XI — termina describiendo con precisión qué ocurre cuando lanzas una moneda cinco, diez o cien veces. Una estructura abstracta creada para contar objetos resulta describir fenómenos aleatorios.

Y hay un detalle más que merece una mención. A medida que el número de lanzamientos crece, las filas del triángulo se parecen cada vez más a la curva de campana de Gauss: esa curva ubicua que aparece en la estadística, la física y la biología. La razón profunda de esa convergencia es otra historia, pero el hecho de que un triángulo de sumas tan simples contenga la semilla de una de las distribuciones más importantes de la ciencia es, como mínimo, hermoso.

Las matemáticas tienen esa cualidad única: revelan patrones ocultos detrás de lo que parece puro azar. Un lanzamiento de moneda es impredecible. Diez lanzamientos ya insinúan un orden. Cien lanzamientos dibujan una curva casi perfecta. Y todo estaba escrito, desde el principio, en un triángulo.

Pon la teoría en práctica: [lanza una moneda online](https://flipthecoin.app/es/play/) y observa la combinatoria en acción.
