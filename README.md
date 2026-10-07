# PONG — Retro Arcade

Um tributo moderno ao clássico **Pong**, lançado pela Atari em 1972, recriado com uma estética inspirada em **fliperamas CRT, telas LCD e Game Boy**.

O projeto transforma o conceito original em uma experiência completa para navegador, adicionando diferentes modos de jogo, níveis de CPU, power-ups, sistema de conquistas, recordes, controles para teclado e dispositivos móveis e suporte à instalação como **Progressive Web App (PWA)**.

<img width="480" height="300" alt="preview" src="https://github.com/user-attachments/assets/67f9f521-d0b1-4b8d-8775-72769d90b1fb" />

> O GIF de demonstração foi gerado a partir da própria lógica do jogo, utilizando uma partida simulada e renderizada pelo mesmo sistema visual utilizado durante a execução normal.

**Jogue agora:**
https://joaorizzo0112.github.io/pong-retro/

---

## Visão geral

**PONG — Retro Arcade** foi desenvolvido para recriar a simplicidade e a identidade visual dos jogos clássicos, mas com recursos modernos de navegador.

O projeto não depende de frameworks ou bibliotecas externas para executar o jogo. Toda a experiência é construída utilizando **HTML, CSS e JavaScript**, com o Canvas 2D responsável pela renderização da partida.

Além do modo clássico, o jogo possui diferentes regras e desafios que alteram completamente a forma de jogar.

### Principais características

* 6 modos de jogo
* 4 níveis de dificuldade da CPU
* Sistema de power-ups
* 37 conquistas
* Sistema de platina
* Multiplayer local para 2 jogadores
* Controles por teclado e toque
* 11 temas visuais
* Sistema de recordes
* Modo de treino
* Menu de pausa
* Áudio utilizando Web Audio API
* Salvamento local com `localStorage`
* PWA instalável
* Funcionamento offline
* Interface responsiva
* Navegação por teclado, mouse e toque

---

## Modos de jogo

O jogo possui **6 modos**, cada um com uma mecânica diferente.

| Modo              | Descrição                                                                                   |
| ----------------- | ------------------------------------------------------------------------------------------- |
| **Clássico**      | A experiência tradicional de Pong. O primeiro jogador a atingir a pontuação definida vence. |
| **Turbo**         | A bola começa mais rápida e acelera ainda mais durante a partida.                           |
| **Multibola**     | Duas bolas ficam simultaneamente em jogo.                                                   |
| **Encolhe**       | As raquetes diminuem progressivamente conforme a partida avança.                            |
| **Paredão**       | Modo solo contra a parede, com 3 vidas e recorde baseado no número de rebatidas.            |
| **Sobrevivência** | O jogador possui 3 vidas e a CPU aumenta progressivamente sua dificuldade.                  |

### Pontuação do modo clássico

O modo clássico permite partidas com:

```text
5 pontos
7 pontos
11 pontos
```

---

## CPU

A CPU possui **4 níveis de dificuldade**, cada um utilizando uma abordagem diferente para acompanhar e interceptar a bola.

| Nível       | Comportamento                                                                             |
| ----------- | ----------------------------------------------------------------------------------------- |
| **Fácil**   | Reage lentamente, acompanha a bola de forma simples e comete erros com frequência.        |
| **Médio**   | Calcula a trajetória da bola, mas não considera corretamente todas as quicadas.           |
| **Difícil** | Prevê a trajetória considerando as quicadas e reage com maior velocidade.                 |
| **Insano**  | Utiliza uma IA extremamente agressiva, rápida e precisa, buscando dificultar a devolução. |

A dificuldade não é apenas uma mudança artificial de velocidade. Cada nível utiliza comportamentos diferentes para determinar como a CPU tenta interceptar a bola.

### Desempenho da CPU

Em simulações com milhares de saques iguais, os resultados observados foram aproximadamente:

| CPU     | Taxa de devolução |
| ------- | ----------------: |
| Fácil   |         39% — 86% |
| Médio   |         77% — 96% |
| Difícil |        95% — 100% |
| Insano  |              ~99% |

Os resultados variam conforme a velocidade e o ângulo da bola.

No nível **Insano**, contra um adversário que também tenta explorar as extremidades da raquete, a CPU venceu aproximadamente **9 de cada 10 partidas** nas simulações realizadas.

Apesar disso, o modo continua tecnicamente vencível.

---

## Física da bola

A velocidade da bola aumenta progressivamente durante a partida.

O ponto de contato com a raquete também influencia o resultado:

* Centro da raquete → trajetória mais previsível
* Extremidades → alteração maior do ângulo
* Maior velocidade → menor tempo de reação
* Rebatidas consecutivas → aumento progressivo da dificuldade

Isso permite que o jogador controle parcialmente a direção da bola através do posicionamento da raquete.

---

## Power-ups

Os power-ups podem ser ativados em:

```text
Opções → POWER-UPS
```

Quando habilitados, caixas aparecem durante a partida.

O jogador que realizou a última rebatida pode coletar o power-up quando a bola entrar em contato com a caixa.

| Letra | Power-up | Efeito                                                        |
| ----- | -------- | ------------------------------------------------------------- |
| **G** | Grande   | A própria raquete aumenta durante 8 segundos.                 |
| **L** | Lento    | A bola fica mais lenta durante 5 segundos.                    |
| **I** | Inverter | Os controles do adversário são invertidos durante 5 segundos. |
| **E** | Encolher | A raquete do adversário diminui durante 8 segundos.           |

Os power-ups são opcionais e podem ser ativados ou desativados nas opções do jogo.

---

## Conquistas

O jogo possui **37 conquistas**.

O sistema inclui:

* Conquistas relacionadas aos diferentes modos
* Desafios de desempenho
* Objetivos específicos
* **7 conquistas consideradas impossíveis**
* Uma conquista especial de **Platina**

### PONG Platinado

A conquista:

```text
PONG Platinado
```

representa a conclusão do sistema de conquistas do jogo.

As conquistas são armazenadas localmente e permanecem disponíveis entre sessões utilizando `localStorage`.

---

## Controles

O jogo pode ser controlado utilizando teclado, mouse ou toque.

### Teclado

| Ação             | Jogador 1 | Jogador 2 |
| ---------------- | --------- | --------- |
| Mover para cima  | `W` / `↑` | `↑`       |
| Mover para baixo | `S` / `↓` | `↓`       |

### Controles principais

| Ação                    | Teclado           | Celular        |
| ----------------------- | ----------------- | -------------- |
| **Pausar**              | `Espaço`          | Botão de pausa |
| **Navegar pelos menus** | `W A S D` / Setas | Toque          |
| **Confirmar**           | `Enter`           | Toque          |
| **Voltar**              | `Esc`             | Menu de pausa  |

No modo para dois jogadores, ambos podem utilizar o mesmo teclado.

### Dispositivos móveis

No celular, os controles são adaptados para toque:

* Arraste o dedo na área da quadra para controlar o jogador.
* O lado direito da tela pode ser utilizado pelo segundo jogador.
* Os menus são navegáveis por toque.

---

## Personalização

O jogo possui **11 temas visuais**.

Entre eles está uma opção inspirada diretamente na estética do **Game Boy**, utilizando a tradicional aparência monocromática verde.

A interface também utiliza elementos visuais inspirados em:

* CRT
* LCD
* Arcades
* Consoles portáteis
* Jogos retrô

---

## Velocidade da raquete

A velocidade das raquetes pode ser configurada entre:

```text
0.75×
1.00×
1.25×
1.50×
1.75×
2.00×
2.25×
2.50×
2.75×
3.00×
```

Isso permite adaptar o controle para diferentes estilos de jogo e níveis de dificuldade.

---

## Modo de treino

O projeto também possui um **modo de treino jogável**, permitindo praticar sem depender de uma partida tradicional.

Além disso, os recordes são armazenados localmente para acompanhar o desempenho do jogador.

---

## Sistema de pausa

Durante uma partida, o jogador pode abrir o menu de pausa.

As opções disponíveis incluem:

```text
Continuar
Reiniciar
Sair para o menu
```

Isso permite interromper a partida sem perder o controle da aplicação.

---

# PWA — Aplicativo instalável

O projeto também funciona como um **Progressive Web App (PWA)**.

Isso significa que o jogo pode ser instalado como um aplicativo, sem precisar de uma loja de aplicativos.

### Android / Chrome / Edge

Utilize o botão:

```text
INSTALAR APP
```

dentro do jogo ou o ícone de instalação disponível na barra de endereço do navegador.

### iPhone / iPad

No Safari:

```text
Compartilhar
    ↓
Adicionar à Tela de Início
```

Depois de instalado, o jogo pode ser executado em uma janela própria e continuar funcionando mesmo sem conexão com a internet.

### Atualizações

Quando uma nova versão for publicada, abra o aplicativo novamente com conexão à internet para permitir que o Service Worker atualize os arquivos armazenados em cache.

---

# Funcionamento offline

O funcionamento offline é possibilitado pelo **Service Worker**.

A estrutura utiliza:

```text
manifest.json
sw.js
```

O `manifest.json` fornece as informações necessárias para instalação como aplicativo, enquanto o `sw.js` controla o cache dos recursos necessários para execução offline.

---

# Arquitetura do projeto

```text
pong-retro/
│
├── index.html
│
├── css/
│   └── style.css
│
├── js/
│   └── game.js
│
├── icons/
│   ├── icon-192.png
│   ├── icon-512.png
│   └── icon-maskable-512.png
│
├── docs/
│   └── preview.gif
│
├── manifest.json
├── sw.js
│
└── tools/
    └── build-single-file.py
```

### `index.html`

Responsável pela estrutura das telas e elementos da interface.

Inclui:

* Menu principal
* Seleção de modos
* Opções
* Ajuda
* Conquistas
* Créditos
* Interface da partida
* Menu de pausa

### `css/style.css`

Controla toda a apresentação visual do projeto.

Inclui:

* Layout responsivo
* Efeitos CRT
* Texturas LCD
* Temas
* Menus
* HUD
* Animações
* Adaptação para diferentes tamanhos de tela

O layout utiliza principalmente unidades relativas, incluindo `cqw`, para manter os elementos proporcionais à área disponível.

### `js/game.js`

É o núcleo do jogo.

O arquivo concentra:

* Estado da partida
* Física da bola
* Movimento das raquetes
* IA da CPU
* Modos de jogo
* Power-ups
* Sistema de conquistas
* Recordes
* Áudio
* Controles
* Menus
* Sistema de instalação PWA

O projeto utiliza um único script, sem módulos JavaScript separados.

### `manifest.json`

Define as informações utilizadas pelo navegador para transformar o jogo em um aplicativo instalável.

### `sw.js`

Implementa o Service Worker responsável pelo cache e pelo funcionamento offline.

### `icons/`

Contém os ícones utilizados pelo PWA.

São disponibilizadas versões:

```text
192 × 192
512 × 512
512 × 512 Maskable
```

### `docs/`

Contém os materiais utilizados na documentação do projeto, incluindo o GIF de demonstração.

### `tools/build-single-file.py`

Script auxiliar utilizado para gerar uma versão de arquivo único do projeto.

---

# Versão single-file

Embora o projeto esteja organizado em arquivos separados para facilitar manutenção e desenvolvimento, existe uma ferramenta para gerar uma versão contendo:

```text
HTML
+
CSS
+
JavaScript
```

em um único arquivo.

Execute:

```bash
python3 tools/build-single-file.py
```

Isso permite gerar uma versão compacta para cenários em que seja interessante distribuir o jogo como uma única página.

---

# Tecnologias

O projeto foi desenvolvido utilizando tecnologias nativas da Web.

| Tecnologia           | Utilização                                  |
| -------------------- | ------------------------------------------- |
| **HTML5**            | Estrutura da aplicação                      |
| **CSS3**             | Interface, responsividade e efeitos visuais |
| **JavaScript**       | Lógica completa do jogo                     |
| **Canvas 2D**        | Renderização da partida                     |
| **Web Audio API**    | Efeitos sonoros                             |
| **LocalStorage**     | Recordes, opções e conquistas               |
| **Service Worker**   | Cache e funcionamento offline               |
| **Web App Manifest** | Instalação como PWA                         |
| **Python**           | Geração da versão single-file               |

Não são necessários frameworks ou bibliotecas JavaScript para executar o jogo.

---

# Executando localmente

Clone o repositório:

```bash
git clone https://github.com/joaorizzo0112/pong-retro.git
```

Entre na pasta:

```bash
cd pong-retro
```

Como o projeto é composto por tecnologias Web puras, não é necessário instalar dependências com npm.

Para desenvolvimento local, recomenda-se utilizar um servidor HTTP.

Por exemplo, com Python:

```bash
python3 -m http.server 8000
```

Depois abra:

```text
http://localhost:8000
```

> O uso de um servidor local é recomendado principalmente por causa do comportamento do Service Worker e de outros recursos que dependem de um contexto HTTP.
>
> #

---

# Compatibilidade

O jogo foi desenvolvido utilizando APIs disponíveis nos navegadores modernos.

É possível executá-lo em:

* Chrome
* Edge
* Firefox
* Safari
* Navegadores móveis modernos

O suporte à instalação como PWA pode variar de acordo com o navegador e o sistema operacional.

---

# Design

A identidade visual combina elementos de diferentes gerações dos videogames.

A proposta é misturar:

```text
Pong clássico
      +
Arcade CRT
      +
LCD retrô
      +
Game Boy
      +
Web moderna
```

O resultado é uma interface que tenta preservar a simplicidade do Pong original enquanto adiciona uma camada visual e funcional mais completa.

---

# Inspiração

O projeto é inspirado em **Pong**, desenvolvido pela Atari e lançado em 1972.

Pong foi criado por **Allan Alcorn** e tornou-se um dos jogos mais importantes da história dos videogames.

Este projeto é uma recriação independente para fins de estudo, experimentação e entretenimento.

---

# Créditos

**Desenvolvimento:** João — [@joaorizzo0112](https://github.com/joaorizzo0112)

**Inspiração:** Pong — Atari (1972)

**Criador de Pong:** Allan Alcorn

**Fonte:** [Press Start 2P](https://fonts.google.com/specimen/Press+Start+2P) — CodeMan38, licenciada sob OFL.

---

# Licença

Este projeto é disponibilizado para fins de estudo, experimentação e entretenimento.

Os elementos relacionados à franquia **Pong** e à Atari pertencem aos seus respectivos detentores de direitos.

---

# Autor

<div align="center">

### João Rizzo

Estudante de Ciência da Computação e desenvolvedor do projeto.

[GitHub](https://github.com/joaorizzo0112)

</div>

---

<div align="center">

**PONG — Retro Arcade**

*Um clássico de 1972, reimaginado para a Web.*

</div>
