---
title: Flip The Coin – Extensión del navegador
slug: extension
_locale: es
description: Un lanzamiento de moneda 3D justo y aleatorio, directamente en la barra de tu navegador. La misma física que flipthecoin.app, a un clic.
---

# Flip The Coin – Extensión del navegador

¿No puedes decidir entre dos opciones? Lanza una moneda — sin salir de la pestaña en la que estás.

La extensión de navegador Flip The Coin pone la misma moneda 3D de [flipthecoin.app](https://flipthecoin.app) a un clic en tu barra de herramientas. Haz clic en el icono, pulsa **Lanzar la moneda** y deja que el destino decida.

## Qué hace

- Abre un popup compacto (360×460) con la escena 3D completa de la moneda.
- Un único botón **Lanzar la moneda** dispara el lanzamiento con exactamente la misma física que la app web — compartimos el código de animación entre ambas, así que la moneda se siente idéntica donde la uses.
- Muestra el resultado (Cara, Cruz o, ocasionalmente, Canto) en cuanto la moneda se detiene.
- Eso es todo. Sin rastreo, sin analítica, sin peticiones de red, sin permisos.

## Instalar

### <span aria-hidden="true" style="display:inline-block;width:20px;height:20px;background-color:currentColor;-webkit-mask:url(/img/icons/google-chrome-logo-svgrepo-com.svg) no-repeat center/contain;mask:url(/img/icons/google-chrome-logo-svgrepo-com.svg) no-repeat center/contain;vertical-align:-3px;margin-right:4px"></span>Navegadores Chromium (Chrome, Edge, Brave, Arc, Opera…)

La extensión está disponible en la **Chrome Web Store** y funciona en cualquier navegador basado en Chromium:

**[Añadir a Chrome (y todos los navegadores Chromium) →](https://chromewebstore.google.com/detail/afkjlnjcpgjiecnfhkokeohlmipchohc?utm_source=item-share-cb)**

#### O instalar desde el código

```bash
git clone https://github.com/paulmelero/flipthecoinapp.git
cd flipthecoinapp
pnpm install
pnpm --filter @flipthecoin/extension build:chrome
```

Luego, en Chrome (o cualquier navegador Chromium), ve a `chrome://extensions`, activa el **Modo desarrollador**, haz clic en **Cargar descomprimida** y selecciona `apps/extension/dist/chrome/`.

### <span aria-hidden="true" style="display:inline-block;width:20px;height:20px;background-color:currentColor;-webkit-mask:url(/img/icons/firefox-logo.svg) no-repeat center/contain;mask:url(/img/icons/firefox-logo.svg) no-repeat center/contain;vertical-align:-3px;margin-right:4px"></span>Firefox

La extensión está disponible en **Firefox Add-ons** (AMO):

**[Añadir a Firefox →](https://addons.mozilla.org/en-GB/firefox/addon/flip-the-coin/)**

#### O instalar desde el código

```bash
git clone https://github.com/paulmelero/flipthecoinapp.git
cd flipthecoinapp
pnpm install
pnpm --filter @flipthecoin/extension build:firefox
```

Luego, en Firefox, ve a `about:debugging#/runtime/this-firefox`, haz clic en **Cargar complemento temporal…** y selecciona cualquier archivo dentro de `apps/extension/dist/firefox/`.

## Privacidad

La extensión no recopila, almacena ni transmite ningún dato. No tiene permisos y no hace peticiones de red — la escena 3D, la física, las texturas y las fuentes se empaquetan todas con la extensión. Tus lanzamientos son tuyos.

## Advertencia

El lanzamiento de moneda es aleatorio y es solo para entretenimiento. No lo uses, por favor, para tomar decisiones de las que te vayas a arrepentir, y consulta nuestra [Política de privacidad](/privacy-policy) y [Términos del servicio](/terms) para el resto de la letra pequeña.
