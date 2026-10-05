⏱️ Ignite Timer
🇧🇷 Português · 🇺🇸 English

Projeto desenvolvido durante o Ignite da Rocketseat: um timer no estilo Pomodoro para registrar ciclos de foco em tarefas, com histórico.

Project built during Rocketseat's Ignite program: a Pomodoro-style timer to track focus cycles on tasks, with a history page.

🇧🇷 Português
Sumário
Sobre o projeto
Funcionalidades
Tecnologias
Como rodar
Estrutura de pastas
Arquitetura e fluxo de dados
O que aprendi
Vite e TypeScript
Ponto de entrada da aplicação
Estilização com styled-components
Tipando o tema
Props tipadas em styled-components
Roteamento com React Router
Formulários com React Hook Form
Estado e imutabilidade
Context API
useEffect e o countdown
useCallback
Datas com date-fns
Renderização condicional e listas
Ícones com Phosphor
Acessibilidade
Qualidade de código: ESLint e Prettier
Fontes do Google Fonts
Sobre o projeto
O Ignite Timer permite que você informe em qual tarefa vai trabalhar e por quantos minutos. Ao iniciar, um contador regressivo aparece na tela (e também no título da aba do navegador). O ciclo pode ser concluído naturalmente ou interrompido, e todos os ciclos ficam registrados na página de histórico com seu status.

Funcionalidades
Criar um novo ciclo informando o nome da tarefa e a duração (de 5 a 60 minutos, de 5 em 5).
Sugestões de nomes de tarefa através de um <datalist>.
Contador regressivo em MM:SS, atualizado a cada segundo.
Título da aba do navegador mostrando o tempo restante.
Interromper o ciclo ativo.
Marcar o ciclo como concluído automaticamente quando o tempo acaba.
Página de histórico com tarefa, duração, início relativo ("há 5 minutos") e status (Concluído, Interrompido ou Em andamento).
Navegação entre Timer e Histórico mantendo o estado do ciclo.
Tecnologias
Categoria	Ferramenta
Biblioteca de UI	React 19
Linguagem	TypeScript
Build / dev server	Vite
Estilização	styled-components
Rotas	React Router
Formulários	React Hook Form
Datas	date-fns
Ícones	Phosphor Icons (phosphor-react)
Lint / formatação	ESLint + Prettier
Como rodar
Pré-requisito: Node.js instalado.

npm install
npm run dev
Depois, abra o endereço exibido no terminal (normalmente http://localhost:5173).

Outros scripts disponíveis:

Script	O que faz
npm run dev	Sobe o servidor de desenvolvimento com HMR (hot reload).
npm run build	Checa os tipos com tsc -b e gera a versão de produção em dist/.
npm run preview	Serve localmente o conteúdo de dist/ para testar o build.
npm run lint	Roda o ESLint em todo o projeto.
npm run lint:fix	Roda o ESLint corrigindo o que for possível automaticamente.
npm run format	Formata todos os arquivos com o Prettier.
Estrutura de pastas
src/
├── @types/
│   └── styled.d.ts              # tipagem do tema do styled-components
├── assets/
│   └── Logo.svg
├── components/
│   ├── Header/                  # cabeçalho com logo e navegação
│   │   ├── Index.tsx
│   │   └── styles.ts
│   └── global.ts                # estilos globais (createGlobalStyle)
├── contexts/
│   ├── CyclesContext.ts         # tipos + createContext
│   └── CyclesContextProvider.tsx# estado e regras dos ciclos
├── layouts/
│   └── DefaultLayouts/          # layout com Header + <Outlet />
├── pages/
│   ├── Home/
│   │   ├── components/
│   │   │   ├── Countdown/       # contador regressivo
│   │   │   └── NewCycleForm/    # campos "tarefa" e "minutos"
│   │   ├── Index.tsx
│   │   └── styles.ts
│   └── History/                 # tabela de histórico
├── styles/
│   └── themes/
│       └── default.ts           # paleta de cores do tema
├── App.tsx                      # providers (tema, rotas, contexto)
├── main.tsx                     # ponto de entrada
└── router.tsx                   # definição das rotas
Padrão adotado: cada componente tem sua pasta, com o componente (Index.tsx/index.tsx) e seus estilos (styles.ts) lado a lado. Componentes usados só por uma página ficam dentro de pages/<Página>/components.

Arquitetura e fluxo de dados
flowchart TD
    main[main.tsx] --> App
    App --> ThemeProvider
    ThemeProvider --> BrowserRouter
    BrowserRouter --> Provider[CyclesContextProvider]
    Provider --> Router
    Router --> Layout[DefaultLayout<br/>Header + Outlet]
    Layout -->|"/"| Home
    Layout -->|"/history"| History
    Home --> NewCycleForm
    Home --> Countdown
    Provider -. "use(CyclesContext)" .-> Home
    Provider -. "use(CyclesContext)" .-> NewCycleForm
    Provider -. "use(CyclesContext)" .-> Countdown
    Provider -. "use(CyclesContext)" .-> History
O CyclesContextProvider guarda todo o estado dos ciclos (cycles, activeCycleId, amountSecondsPassed) e expõe as funções que o alteram.
Como o provider envolve o Router, o estado sobrevive à troca de página: dá para ir ao histórico e voltar sem perder o timer.
Cada componente consome só o que precisa do contexto, sem precisar receber props de componentes pais.
O que aprendi
1. Vite e TypeScript
O projeto foi criado com o Vite, que oferece um servidor de desenvolvimento muito rápido (usa ES Modules nativos do navegador) e HMR, que atualiza a tela sem perder o estado ao salvar um arquivo.
O index.html fica na raiz e é o verdadeiro ponto de entrada: ele carrega /src/main.tsx com <script type="module">.
O plugin @vitejs/plugin-react habilita JSX e o Fast Refresh.
O TypeScript é configurado com project references: o tsconfig.json apenas aponta para dois outros arquivos:
tsconfig.app.json → código da aplicação (src), com lib: ["ES2023", "DOM"] e jsx: "react-jsx".
tsconfig.node.json → arquivos que rodam no Node, como o vite.config.ts.
noEmit: true: quem gera o JavaScript é o Vite; o tsc só verifica os tipos (por isso o script build é tsc -b && vite build).
Opções de linting do compilador, como noUnusedLocals e noUnusedParameters, ajudam a manter o código limpo.
verbatimModuleSyntax obriga a marcar importações que são só de tipo com type, por exemplo:
import { type ReactNode, useCallback, useState } from 'react';
2. Ponto de entrada da aplicação
// src/main.tsx
createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
createRoot (de react-dom/client) cria a raiz do React dentro da <div id="root">.
O ! (non-null assertion) diz ao TypeScript: "garanto que esse elemento existe", já que getElementById pode retornar null.
StrictMode só atua em desenvolvimento: executa alguns efeitos e renderizações duas vezes para ajudar a encontrar bugs (por exemplo, um useEffect sem função de limpeza).
O App.tsx é onde ficam os providers, empilhados um dentro do outro:
<ThemeProvider theme={defaultTheme}>
  <BrowserRouter>
    <CyclesContextProvider>
      <Router />
    </CyclesContextProvider>
  </BrowserRouter>
  <GlobalStyled />
</ThemeProvider>
3. Estilização com styled-components
CSS-in-JS: o CSS é escrito em template strings e vira um componente React com uma classe gerada automaticamente (sem conflito de nomes entre componentes).

export const HeaderContainer = styled.header`
  display: flex;
  justify-content: space-between;

  nav {
    a {
      color: ${(props) => props.theme['gray-100']};

      &:hover {
        border-bottom: 3px solid ${(props) => props.theme['green-500']};
      }
    }
  }
`;
O que foi praticado:

Aninhamento de seletores (nav { a { ... } }) e uso do & para pseudo-classes (&:hover, &:disabled, &:not(:disabled):hover, &:first-child).
Pseudo-elementos, como &::before para desenhar a bolinha colorida do status e &::placeholder para o placeholder do input.
Acesso ao tema via props.theme, graças ao ThemeProvider no App.
Herança de estilos com styled(Componente): um componente base com o estilo comum e variações que só adicionam o que muda.
const BaseInput = styled.input`
  /* estilos comuns */
`;

export const TaskInput = styled(BaseInput)`
  flex: 1;
`;

export const MinutesAmountInput = styled(BaseInput)`
  width: 4rem;
`;
O mesmo padrão aparece em BaseCountdownButton → StartCountdownButton (verde) e StopCountdownButton (vermelho).

Estilos globais com createGlobalStyle (reset de margin/padding, box-sizing, cor de fundo, fonte padrão e estilo de foco):
export const GlobalStyled = createGlobalStyle`
  * { margin: 0; padding: 0; box-sizing: border-box; }

  :focus {
    outline: 0;
    box-shadow: 0 0 0 2px ${(props) => props.theme['green-500']};
  }
`;
Layout com Flexbox: flex: 1 para ocupar o espaço disponível, flex-direction: column, gap, flex-wrap e centralização com align-items/justify-content.
Unidades rem e calc(100vh - 10rem) para a altura do layout.
A extensão styled-components.vscode-styled-components (recomendada em .vscode/extensions.json) dá syntax highlight ao CSS dentro das template strings.
4. Tipando o tema
O tema é um objeto simples com a paleta de cores:

// src/styles/themes/default.ts
export const defaultTheme = {
  'gray-100': '#E1E1E6',
  'green-500': '#00875F',
  'red-500': '#AB222E',
  // ...
};
Para que props.theme['green-500'] tenha autocomplete e checagem de tipos, foi criado um arquivo de declaração (.d.ts) que usa declaration merging para estender a interface DefaultTheme do styled-components:

// src/@types/styled.d.ts
import 'styled-components';
import { defaultTheme } from '../styles/themes/default';

type ThemeType = typeof defaultTheme;

declare module 'styled-components' {
  export interface DefaultTheme extends ThemeType {}
}
typeof defaultTheme extrai o tipo a partir do valor, então basta adicionar uma cor no objeto que ela já aparece no autocomplete.
declare module reabre o módulo da biblioteca para acrescentar informações de tipo.
Se você digitar props.theme['green-501'], o TypeScript acusa erro.
5. Props tipadas em styled-components
Um styled-component pode receber props próprias, tipadas com generics:

const STATUS_COLORS = {
  yellow: 'yellow-500',
  green: 'green-500',
  red: 'red-500',
} as const;

interface StatusProps {
  statusColor: keyof typeof STATUS_COLORS;
}

export const Status = styled.span<StatusProps>`
  &::before {
    background: ${(props) => props.theme[STATUS_COLORS[props.statusColor]]};
  }
`;
<Status statusColor="green">Concluído</Status>
as const transforma os valores em literais ('green-500' em vez de string), permitindo usá-los como chave do tema com segurança.
keyof typeof STATUS_COLORS gera a união 'yellow' | 'green' | 'red', então só essas três cores são aceitas na prop.
O mapa STATUS_COLORS separa o nome semântico usado no componente da chave real do tema.
6. Roteamento com React Router
// src/router.tsx
<Routes>
  <Route path="/" element={<DefaultLayout />}>
    <Route path="/" element={<Home />} />
    <Route path="/history" element={<History />} />
  </Route>
</Routes>
BrowserRouter (no App) usa a History API do navegador para ter URLs reais (/history) sem recarregar a página — uma SPA.
Routes / Route mapeiam caminhos para componentes.
Rotas aninhadas + layout: a rota pai renderiza o DefaultLayout, e as rotas filhas aparecem no lugar do <Outlet />. Assim o Header é escrito uma vez só e compartilhado por todas as páginas.
export function DefaultLayout() {
  return (
    <LayoutContainer>
      <Header />
      <Outlet />
    </LayoutContainer>
  );
}
NavLink é um link que navega sem recarregar a página e sabe se a rota está ativa (adiciona automaticamente a classe active).
<NavLink to="/" title="timer">
  <Timer size={24} />
</NavLink>
7. Formulários com React Hook Form
Controlled vs. uncontrolled: em um formulário controlado, cada tecla digitada atualiza um estado e re-renderiza o componente. O React Hook Form trabalha de forma não controlada (lê os valores direto dos inputs via ref), o que deixa o formulário mais performático e o código mais enxuto.

interface NewCycleFormData {
  task: string;
  minutesAmount: number;
}

const newCycleForm = useForm<NewCycleFormData>();
const { handleSubmit, watch, reset } = newCycleForm;
useForm<T>() cria o formulário já tipado com o formato dos dados.
register('campo') conecta um input ao formulário, devolvendo name, ref, onChange e onBlur (por isso o spread {...register('task')}).
valueAsNumber: true converte o valor do input para number automaticamente.
<MinutesAmountInput
  type="number"
  step={5}
  min={5}
  max={60}
  {...register('minutesAmount', { valueAsNumber: true })}
/>
handleSubmit(fn) previne o comportamento padrão do submit e chama fn com os dados já coletados.
watch('task') observa um campo em tempo real; foi usado para desabilitar o botão enquanto a tarefa estiver vazia:
const task = watch('task');
const isSubmitDisabled = !task;
reset() limpa o formulário depois de criar o ciclo.
FormProvider + useFormContext: o formulário é criado na Home, mas os inputs ficam no componente NewCycleForm. Em vez de passar register por props, a Home envolve o filho com FormProvider, e o filho recupera os métodos com useFormContext():
// Home
<FormProvider {...newCycleForm}>
  <NewCycleForm />
</FormProvider>;

// NewCycleForm
const { register } = useFormContext();
void em Promises: handleSubmit retorna uma Promise. Como o onSubmit não espera esse retorno, o lint com checagem de tipos pede que isso fique explícito:
<form onSubmit={(event) => void handleSubmit(handleCreateNewCycle)(event)}>
8. Estado e imutabilidade
const [cycles, setCycles] = useState<Cycle[]>([]);
const [activeCycleId, setActiveCycleId] = useState<string | null>(null);
const [amountSecondsPassed, setAmountSecondsPassed] = useState(0);
useState<T> com generics para tipar estados que começam vazios ([] ou null).
Imutabilidade: o React só detecta mudanças quando recebe um novo objeto/array. Por isso nunca usamos push ou alteramos o objeto direto; criamos cópias com spread e map:
// adicionar
setCycles((state) => [...state, newCycle]);

// alterar um item
setCycles((state) =>
  state.map((cycle) =>
    cycle.id === activeCycleId ? { ...cycle, interruptedDate: new Date() } : cycle,
  ),
);
Atualização funcional ((state) => ...): quando o novo valor depende do anterior, usar a função garante que estamos trabalhando com o estado mais recente.
Estado derivado: o ciclo ativo não é um estado separado; ele é calculado a partir de outros dois, evitando dados duplicados e dessincronizados:
const activeCycle = cycles.find((cycle) => cycle.id === activeCycleId);
Modelagem dos dados com interfaces e campos opcionais (?): o status do ciclo é deduzido de quais datas existem.
export interface Cycle {
  id: string;
  task: string;
  minutesAmount: number;
  startDate: Date;
  interruptedDate?: Date;
  finishedDate?: Date;
}
Um id único simples foi gerado com o timestamp: String(new Date().getTime()).
9. Context API
Problema: Home, NewCycleForm, Countdown e History precisam das mesmas informações. Passar tudo por props de pai para filho (prop drilling) fica trabalhoso e acopla os componentes.

Solução: um contexto que disponibiliza o estado para qualquer componente abaixo do provider.

Criar o contexto com o tipo (CyclesContext.ts):
interface CyclesContextType {
  cycles: Cycle[];
  activeCycle: Cycle | undefined;
  activeCycleId: string | null;
  amountSecondsPassed: number;
  markCurrentCycleAsFinished: () => void;
  setSecondsPassed: (seconds: number) => void;
  createNewCycle: (data: CreateCycleData) => void;
  interruptCurrentCycle: () => void;
}

export const CyclesContext = createContext({} as CyclesContextType);
Criar um componente provider (CyclesContextProvider.tsx) que concentra o estado e as regras de negócio, recebendo children: ReactNode. No React 19, o próprio contexto pode ser usado como provider (antes era <CyclesContext.Provider>):
return (
  <CyclesContext value={{ cycles, activeCycle, createNewCycle /* ... */ }}>
    {children}
  </CyclesContext>
);
Consumir o contexto com o novo hook use() do React 19 (equivalente ao useContext):
const { activeCycle, createNewCycle, interruptCurrentCycle } = use(CyclesContext);
Boas práticas aprendidas:

Separar o contexto do provider em dois arquivos: a regra react-refresh/only-export-components pede que arquivos .tsx exportem apenas componentes, para o Fast Refresh funcionar corretamente.
Expor funções, não setters crus: os componentes chamam createNewCycle ou interruptCurrentCycle, e a lógica fica centralizada no provider.
Posicionar o provider acima do Router mantém o estado entre páginas.
10. useEffect e o countdown
O Countdown usa useEffect para sincronizar o componente com algo externo ao React: um intervalo de tempo.

useEffect(() => {
  let interval: number;
  if (activeCycle) {
    interval = setInterval(() => {
      const secondsDifference = differenceInSeconds(new Date(), activeCycle.startDate);

      if (secondsDifference >= totalSeconds) {
        markCurrentCycleAsFinished();
        setSecondsPassed(totalSeconds);
        clearInterval(interval);
      } else {
        setSecondsPassed(secondsDifference);
      }
    }, 1000);
  }

  return () => clearInterval(interval);
}, [activeCycle, totalSeconds, markCurrentCycleAsFinished, setSecondsPassed]);
Array de dependências: o efeito roda de novo sempre que um desses valores muda.
Função de limpeza (cleanup): o return () => clearInterval(interval) roda antes do próximo efeito e quando o componente sai da tela. Sem ela, intervalos antigos continuariam rodando em paralelo.
Precisão do tempo: em vez de somar +1 a cada tick (o setInterval não é exato e é desacelerado em abas inativas), o tempo passado é calculado pela diferença entre agora e a data de início. Assim o contador nunca "atrasa".
Cálculo do que é exibido:

const totalSeconds = activeCycle ? activeCycle.minutesAmount * 60 : 0;
const currentSeconds = activeCycle ? totalSeconds - amountSecondsPassed : 0;

const minutesAmount = Math.floor(currentSeconds / 60);
const secondsAmount = currentSeconds % 60;

const minutes = String(minutesAmount).padStart(2, '0'); // 5 -> "05"
const seconds = String(secondsAmount).padStart(2, '0');
Math.floor e o operador de resto % separam minutos e segundos.
padStart(2, '0') garante sempre dois dígitos.
Strings podem ser acessadas por índice (minutes[0], minutes[1]), o que permitiu renderizar cada dígito em sua própria caixa.
Um segundo useEffect sincroniza o título da aba com o contador:

useEffect(() => {
  if (activeCycle) {
    document.title = `${minutes}:${seconds}`;
  }
}, [minutes, seconds, activeCycle]);
11. useCallback
Funções declaradas dentro de um componente são recriadas a cada renderização. Como markCurrentCycleAsFinished está nas dependências do useEffect do Countdown, uma nova referência a cada render faria o intervalo ser recriado o tempo todo.

const markCurrentCycleAsFinished = useCallback(() => {
  setCycles((state) =>
    state.map((cycle) =>
      cycle.id === activeCycleId ? { ...cycle, finishedDate: new Date() } : cycle,
    ),
  );
  setActiveCycleId(null);
}, [activeCycleId]);
useCallback memoriza a função e só cria uma nova quando activeCycleId muda.
Já a função setAmountSecondsPassed (exposta como setSecondsPassed) vem do useState e é estável por natureza, então pode ir direto para o contexto.
12. Datas com date-fns
differenceInSeconds(dataA, dataB): diferença exata em segundos, usada no countdown.
formatDistanceToNow(data, { addSuffix: true, locale: ptBR }): gera textos relativos como "há cerca de 1 hora", usada no histórico.
Localização importando ptBR de date-fns/locale.
A biblioteca é modular: importamos só as funções usadas, o que mantém o bundle pequeno.
13. Renderização condicional e listas
Ternário para alternar entre os botões Começar e Interromper:
{
  activeCycle ? (
    <StopCountdownButton onClick={interruptCurrentCycle} type="button">
      ...
    </StopCountdownButton>
  ) : (
    <StartCountdownButton disabled={isSubmitDisabled} type="submit">
      ...
    </StartCountdownButton>
  );
}
O botão de interromper é type="button" para não disparar o submit do formulário.
&& para mostrar algo apenas quando a condição é verdadeira (status do ciclo).
Listas com map e a prop key única para o React identificar cada linha da tabela:
{
  cycles.map((cycle) => <tr key={cycle.id}>...</tr>);
}
Desabilitar inputs durante um ciclo ativo com disabled={!!activeCycle} (o !! converte o valor em booleano).
14. Ícones com Phosphor
Os ícones são componentes React, configuráveis por props:

import { HandPalm, Play, Scroll, Timer } from 'phosphor-react';

<Timer size={24} />;
Também foi visto como importar um SVG como arquivo (o Vite retorna a URL do asset):

import Logo from '../../assets/Logo.svg';

<img src={Logo} alt="" />;
15. Acessibilidade
<label htmlFor="task"> ligado ao id do input: clicar no texto foca o campo e leitores de tela anunciam o rótulo.
alt="" em imagens decorativas, para que leitores de tela as ignorem.
title nos links que só têm ícone.
<datalist> para sugestões nativas de preenchimento, sem bibliotecas.
Elementos semânticos: header, nav, main, table/thead/tbody.
Estilo de :focus visível para quem navega pelo teclado.
O plugin eslint-plugin-jsx-a11y aponta problemas de acessibilidade direto no editor.
16. Qualidade de código: ESLint e Prettier
O projeto usa o novo formato flat config do ESLint (eslint.config.js):

@eslint/js → regras recomendadas de JavaScript.
typescript-eslint com recommendedTypeChecked → regras que usam as informações de tipo do TypeScript (projectService: true), como detectar Promises não tratadas.
@eslint-react/eslint-plugin → boas práticas específicas de React.
eslint-plugin-jsx-a11y → acessibilidade.
eslint-plugin-react-refresh → garante compatibilidade com o Fast Refresh do Vite.
eslint-plugin-simple-import-sort → ordena os imports automaticamente.
eslint-plugin-prettier/recommended → roda o Prettier como regra do ESLint e desliga regras de estilo conflitantes (sempre por último).
Configurações por tipo de arquivo: globals de navegador para src, globals de Node para arquivos de configuração e regras sem tipos para .js.
Regras customizadas, como permitir variáveis não usadas que comecem com _.
Prettier (.prettierrc.json): aspas simples, ponto e vírgula, 2 espaços, vírgula final e linhas de até 100 caracteres. O .prettierignore exclui dist, node_modules e o package-lock.json.

VS Code (.vscode/settings.json): ao salvar, o ESLint corrige o arquivo (incluindo formatação e ordem dos imports).

.npmrc com legacy-peer-deps=true: faz o npm ignorar conflitos de peer dependencies entre pacotes, comum quando algumas bibliotecas ainda não declaram suporte à versão mais nova do React.

17. Fontes do Google Fonts
No index.html, as fontes Roboto e Roboto Mono são carregadas do Google Fonts. Os <link rel="preconnect"> abrem a conexão com os servidores de fonte antecipadamente, deixando o carregamento mais rápido. O display=swap mostra uma fonte de fallback enquanto a fonte final carrega.

🇺🇸 English
Table of contents
About the project
Features
Tech stack
Getting started
Folder structure
Architecture and data flow
What I learned
Vite and TypeScript
Application entry point
Styling with styled-components
Typing the theme
Typed props in styled-components
Routing with React Router
Forms with React Hook Form
State and immutability
Context API
useEffect and the countdown
useCallback
Dates with date-fns
Conditional rendering and lists
Icons with Phosphor
Accessibility
Code quality: ESLint and Prettier
Google Fonts
About the project
Ignite Timer lets you enter the task you're going to work on and for how many minutes. Once started, a countdown is shown on the screen (and in the browser tab title). A cycle can either finish naturally or be interrupted, and every cycle is recorded on the history page along with its status.

Features
Create a new cycle with a task name and a duration (5 to 60 minutes, in steps of 5).
Task name suggestions through a <datalist>.
MM:SS countdown, updated every second.
Browser tab title showing the remaining time.
Interrupt the active cycle.
Automatically mark the cycle as finished when time runs out.
History page with task, duration, relative start time ("5 minutes ago") and status (Concluído / finished, Interrompido / interrupted, or Em andamento / in progress).
Navigate between Timer and History while keeping the cycle state.
Tech stack
Category	Tool
UI library	React 19
Language	TypeScript
Build / dev server	Vite
Styling	styled-components
Routing	React Router
Forms	React Hook Form
Dates	date-fns
Icons	Phosphor Icons (phosphor-react)
Lint / formatting	ESLint + Prettier
Getting started
Prerequisite: Node.js installed.

npm install
npm run dev
Then open the address printed in the terminal (usually http://localhost:5173).

Other available scripts:

Script	What it does
npm run dev	Starts the dev server with HMR (hot reload).
npm run build	Type-checks with tsc -b and builds the production version into dist/.
npm run preview	Serves the dist/ folder locally to test the build.
npm run lint	Runs ESLint on the whole project.
npm run lint:fix	Runs ESLint and auto-fixes whatever it can.
npm run format	Formats every file with Prettier.
Folder structure
src/
├── @types/
│   └── styled.d.ts              # styled-components theme typing
├── assets/
│   └── Logo.svg
├── components/
│   ├── Header/                  # header with logo and navigation
│   │   ├── Index.tsx
│   │   └── styles.ts
│   └── global.ts                # global styles (createGlobalStyle)
├── contexts/
│   ├── CyclesContext.ts         # types + createContext
│   └── CyclesContextProvider.tsx# cycles state and business rules
├── layouts/
│   └── DefaultLayouts/          # layout with Header + <Outlet />
├── pages/
│   ├── Home/
│   │   ├── components/
│   │   │   ├── Countdown/       # countdown timer
│   │   │   └── NewCycleForm/    # "task" and "minutes" fields
│   │   ├── Index.tsx
│   │   └── styles.ts
│   └── History/                 # history table
├── styles/
│   └── themes/
│       └── default.ts           # theme color palette
├── App.tsx                      # providers (theme, router, context)
├── main.tsx                     # entry point
└── router.tsx                   # route definitions
Convention: each component gets its own folder, with the component (Index.tsx/index.tsx) and its styles (styles.ts) side by side. Components used by a single page live inside pages/<Page>/components.

Architecture and data flow
flowchart TD
    main[main.tsx] --> App
    App --> ThemeProvider
    ThemeProvider --> BrowserRouter
    BrowserRouter --> Provider[CyclesContextProvider]
    Provider --> Router
    Router --> Layout[DefaultLayout<br/>Header + Outlet]
    Layout -->|"/"| Home
    Layout -->|"/history"| History
    Home --> NewCycleForm
    Home --> Countdown
    Provider -. "use(CyclesContext)" .-> Home
    Provider -. "use(CyclesContext)" .-> NewCycleForm
    Provider -. "use(CyclesContext)" .-> Countdown
    Provider -. "use(CyclesContext)" .-> History
CyclesContextProvider holds all cycle state (cycles, activeCycleId, amountSecondsPassed) and exposes the functions that change it.
Because the provider wraps the Router, state survives page changes: you can visit the history page and come back without losing the timer.
Each component reads only what it needs from the context, without receiving props from its parents.
What I learned
1. Vite and TypeScript
The project was scaffolded with Vite, which provides a very fast dev server (built on the browser's native ES Modules) and HMR, updating the screen without losing state when a file is saved.
index.html lives at the project root and is the real entry point: it loads /src/main.tsx through <script type="module">.
The @vitejs/plugin-react plugin enables JSX and Fast Refresh.
TypeScript uses project references: tsconfig.json just points to two other files:
tsconfig.app.json → application code (src), with lib: ["ES2023", "DOM"] and jsx: "react-jsx".
tsconfig.node.json → files that run on Node, such as vite.config.ts.
noEmit: true: Vite produces the JavaScript; tsc only checks types (that's why the build script is tsc -b && vite build).
Compiler linting options such as noUnusedLocals and noUnusedParameters help keep the code clean.
verbatimModuleSyntax requires type-only imports to be marked with type, for example:
import { type ReactNode, useCallback, useState } from 'react';
2. Application entry point
// src/main.tsx
createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
createRoot (from react-dom/client) creates the React root inside <div id="root">.
The ! (non-null assertion) tells TypeScript "I guarantee this element exists", since getElementById can return null.
StrictMode only acts in development: it runs some effects and renders twice to help catch bugs (for example, a useEffect missing its cleanup function).
App.tsx is where the providers live, nested inside each other:
<ThemeProvider theme={defaultTheme}>
  <BrowserRouter>
    <CyclesContextProvider>
      <Router />
    </CyclesContextProvider>
  </BrowserRouter>
  <GlobalStyled />
</ThemeProvider>
3. Styling with styled-components
CSS-in-JS: CSS is written in template strings and becomes a React component with an auto-generated class name (no naming collisions between components).

export const HeaderContainer = styled.header`
  display: flex;
  justify-content: space-between;

  nav {
    a {
      color: ${(props) => props.theme['gray-100']};

      &:hover {
        border-bottom: 3px solid ${(props) => props.theme['green-500']};
      }
    }
  }
`;
What was practiced:

Nesting selectors (nav { a { ... } }) and using & for pseudo-classes (&:hover, &:disabled, &:not(:disabled):hover, &:first-child).
Pseudo-elements, such as &::before to draw the colored status dot and &::placeholder for the input placeholder.
Theme access via props.theme, thanks to the ThemeProvider in App.
Style inheritance with styled(Component): a base component with the shared styles, and variants that only add what differs.
const BaseInput = styled.input`
  /* shared styles */
`;

export const TaskInput = styled(BaseInput)`
  flex: 1;
`;

export const MinutesAmountInput = styled(BaseInput)`
  width: 4rem;
`;
The same pattern shows up in BaseCountdownButton → StartCountdownButton (green) and StopCountdownButton (red).

Global styles with createGlobalStyle (resetting margin/padding, box-sizing, background color, default font and focus style):
export const GlobalStyled = createGlobalStyle`
  * { margin: 0; padding: 0; box-sizing: border-box; }

  :focus {
    outline: 0;
    box-shadow: 0 0 0 2px ${(props) => props.theme['green-500']};
  }
`;
Flexbox layout: flex: 1 to fill available space, flex-direction: column, gap, flex-wrap, and centering with align-items/justify-content.
rem units and calc(100vh - 10rem) for the layout height.
The styled-components.vscode-styled-components extension (recommended in .vscode/extensions.json) adds syntax highlighting to CSS inside template strings.
4. Typing the theme
The theme is a plain object with the color palette:

// src/styles/themes/default.ts
export const defaultTheme = {
  'gray-100': '#E1E1E6',
  'green-500': '#00875F',
  'red-500': '#AB222E',
  // ...
};
To get autocomplete and type checking on props.theme['green-500'], a declaration file (.d.ts) uses declaration merging to extend styled-components' DefaultTheme interface:

// src/@types/styled.d.ts
import 'styled-components';
import { defaultTheme } from '../styles/themes/default';

type ThemeType = typeof defaultTheme;

declare module 'styled-components' {
  export interface DefaultTheme extends ThemeType {}
}
typeof defaultTheme derives the type from the value, so adding a color to the object makes it show up in autocomplete right away.
declare module reopens the library's module to add type information to it.
If you type props.theme['green-501'], TypeScript reports an error.
5. Typed props in styled-components
A styled component can accept its own props, typed with generics:

const STATUS_COLORS = {
  yellow: 'yellow-500',
  green: 'green-500',
  red: 'red-500',
} as const;

interface StatusProps {
  statusColor: keyof typeof STATUS_COLORS;
}

export const Status = styled.span<StatusProps>`
  &::before {
    background: ${(props) => props.theme[STATUS_COLORS[props.statusColor]]};
  }
`;
<Status statusColor="green">Concluído</Status>
as const turns the values into literal types ('green-500' instead of string), so they can safely be used as theme keys.
keyof typeof STATUS_COLORS produces the union 'yellow' | 'green' | 'red', so only those three colors are accepted by the prop.
The STATUS_COLORS map separates the semantic name used in the component from the actual key in the theme.
6. Routing with React Router
// src/router.tsx
<Routes>
  <Route path="/" element={<DefaultLayout />}>
    <Route path="/" element={<Home />} />
    <Route path="/history" element={<History />} />
  </Route>
</Routes>
BrowserRouter (in App) uses the browser's History API to have real URLs (/history) without reloading the page — a SPA.
Routes / Route map paths to components.
Nested routes + layout: the parent route renders DefaultLayout, and child routes are rendered in place of <Outlet />. This way the Header is written once and shared by every page.
export function DefaultLayout() {
  return (
    <LayoutContainer>
      <Header />
      <Outlet />
    </LayoutContainer>
  );
}
NavLink is a link that navigates without reloading the page and knows whether its route is active (it automatically adds the active class).
<NavLink to="/" title="timer">
  <Timer size={24} />
</NavLink>
7. Forms with React Hook Form
Controlled vs. uncontrolled: in a controlled form, every keystroke updates state and re-renders the component. React Hook Form works in an uncontrolled way (it reads values straight from the inputs via ref), which makes the form faster and the code leaner.

interface NewCycleFormData {
  task: string;
  minutesAmount: number;
}

const newCycleForm = useForm<NewCycleFormData>();
const { handleSubmit, watch, reset } = newCycleForm;
useForm<T>() creates the form already typed with the shape of the data.
register('field') connects an input to the form, returning name, ref, onChange and onBlur (hence the spread {...register('task')}).
valueAsNumber: true automatically converts the input value to a number.
<MinutesAmountInput
  type="number"
  step={5}
  min={5}
  max={60}
  {...register('minutesAmount', { valueAsNumber: true })}
/>
handleSubmit(fn) prevents the default submit behavior and calls fn with the collected data.
watch('task') observes a field in real time; it's used to disable the button while the task is empty:
const task = watch('task');
const isSubmitDisabled = !task;
reset() clears the form after the cycle is created.
FormProvider + useFormContext: the form is created in Home, but the inputs live in the NewCycleForm component. Instead of passing register down as a prop, Home wraps the child in FormProvider, and the child retrieves the methods with useFormContext():
// Home
<FormProvider {...newCycleForm}>
  <NewCycleForm />
</FormProvider>;

// NewCycleForm
const { register } = useFormContext();
void on Promises: handleSubmit returns a Promise. Since onSubmit doesn't await it, the type-aware lint rules require making that explicit:
<form onSubmit={(event) => void handleSubmit(handleCreateNewCycle)(event)}>
8. State and immutability
const [cycles, setCycles] = useState<Cycle[]>([]);
const [activeCycleId, setActiveCycleId] = useState<string | null>(null);
const [amountSecondsPassed, setAmountSecondsPassed] = useState(0);
useState<T> with generics to type state that starts empty ([] or null).
Immutability: React only detects changes when it receives a new object/array. That's why we never push or mutate objects directly; we create copies with spread and map:
// add
setCycles((state) => [...state, newCycle]);

// update one item
setCycles((state) =>
  state.map((cycle) =>
    cycle.id === activeCycleId ? { ...cycle, interruptedDate: new Date() } : cycle,
  ),
);
Functional updates ((state) => ...): when the new value depends on the previous one, using a function guarantees we're working with the latest state.
Derived state: the active cycle is not a separate piece of state; it's computed from the other two, avoiding duplicated, out-of-sync data:
const activeCycle = cycles.find((cycle) => cycle.id === activeCycleId);
Data modeling with interfaces and optional fields (?): a cycle's status is inferred from which dates are present.
export interface Cycle {
  id: string;
  task: string;
  minutesAmount: number;
  startDate: Date;
  interruptedDate?: Date;
  finishedDate?: Date;
}
A simple unique id is generated from the timestamp: String(new Date().getTime()).
9. Context API
Problem: Home, NewCycleForm, Countdown and History all need the same information. Passing everything down through props (prop drilling) is tedious and couples components together.

Solution: a context that makes the state available to any component below the provider.

Create the typed context (CyclesContext.ts):
interface CyclesContextType {
  cycles: Cycle[];
  activeCycle: Cycle | undefined;
  activeCycleId: string | null;
  amountSecondsPassed: number;
  markCurrentCycleAsFinished: () => void;
  setSecondsPassed: (seconds: number) => void;
  createNewCycle: (data: CreateCycleData) => void;
  interruptCurrentCycle: () => void;
}

export const CyclesContext = createContext({} as CyclesContextType);
Create a provider component (CyclesContextProvider.tsx) that holds the state and business rules and receives children: ReactNode. In React 19, the context itself can be rendered as the provider (previously <CyclesContext.Provider>):
return (
  <CyclesContext value={{ cycles, activeCycle, createNewCycle /* ... */ }}>
    {children}
  </CyclesContext>
);
Consume the context with React 19's new use() hook (equivalent to useContext):
const { activeCycle, createNewCycle, interruptCurrentCycle } = use(CyclesContext);
Good practices learned:

Split the context and the provider into two files: the react-refresh/only-export-components rule requires .tsx files to export only components, so Fast Refresh works correctly.
Expose functions, not raw setters: components call createNewCycle or interruptCurrentCycle, and the logic stays centralized in the provider.
Placing the provider above the Router keeps state across pages.
10. useEffect and the countdown
Countdown uses useEffect to synchronize the component with something outside React: a timer interval.

useEffect(() => {
  let interval: number;
  if (activeCycle) {
    interval = setInterval(() => {
      const secondsDifference = differenceInSeconds(new Date(), activeCycle.startDate);

      if (secondsDifference >= totalSeconds) {
        markCurrentCycleAsFinished();
        setSecondsPassed(totalSeconds);
        clearInterval(interval);
      } else {
        setSecondsPassed(secondsDifference);
      }
    }, 1000);
  }

  return () => clearInterval(interval);
}, [activeCycle, totalSeconds, markCurrentCycleAsFinished, setSecondsPassed]);
Dependency array: the effect runs again whenever one of these values changes.
Cleanup function: return () => clearInterval(interval) runs before the next effect and when the component unmounts. Without it, old intervals would keep running in parallel.
Time accuracy: instead of adding +1 on each tick (setInterval isn't exact and gets throttled in inactive tabs), elapsed time is computed from the difference between now and the start date. That way the countdown never drifts.
Computing what is displayed:

const totalSeconds = activeCycle ? activeCycle.minutesAmount * 60 : 0;
const currentSeconds = activeCycle ? totalSeconds - amountSecondsPassed : 0;

const minutesAmount = Math.floor(currentSeconds / 60);
const secondsAmount = currentSeconds % 60;

const minutes = String(minutesAmount).padStart(2, '0'); // 5 -> "05"
const seconds = String(secondsAmount).padStart(2, '0');
Math.floor and the remainder operator % split minutes and seconds.
padStart(2, '0') always guarantees two digits.
Strings can be accessed by index (minutes[0], minutes[1]), which made it possible to render each digit in its own box.
A second useEffect syncs the browser tab title with the countdown:

useEffect(() => {
  if (activeCycle) {
    document.title = `${minutes}:${seconds}`;
  }
}, [minutes, seconds, activeCycle]);
11. useCallback
Functions declared inside a component are recreated on every render. Since markCurrentCycleAsFinished is a dependency of Countdown's useEffect, a new reference on every render would cause the interval to be recreated all the time.

const markCurrentCycleAsFinished = useCallback(() => {
  setCycles((state) =>
    state.map((cycle) =>
      cycle.id === activeCycleId ? { ...cycle, finishedDate: new Date() } : cycle,
    ),
  );
  setActiveCycleId(null);
}, [activeCycleId]);
useCallback memoizes the function and only creates a new one when activeCycleId changes.
On the other hand, setAmountSecondsPassed (exposed as setSecondsPassed) comes from useState and is stable by nature, so it can go straight into the context.
12. Dates with date-fns
differenceInSeconds(dateA, dateB): exact difference in seconds, used by the countdown.
formatDistanceToNow(date, { addSuffix: true, locale: ptBR }): produces relative text such as "há cerca de 1 hora" ("about 1 hour ago"), used on the history page.
Localization by importing ptBR from date-fns/locale.
The library is modular: we import only the functions we use, keeping the bundle small.
13. Conditional rendering and lists
Ternary to toggle between the Começar (start) and Interromper (interrupt) buttons:
{
  activeCycle ? (
    <StopCountdownButton onClick={interruptCurrentCycle} type="button">
      ...
    </StopCountdownButton>
  ) : (
    <StartCountdownButton disabled={isSubmitDisabled} type="submit">
      ...
    </StartCountdownButton>
  );
}
The interrupt button is type="button" so it does not submit the form.
&& to render something only when a condition is true (cycle status).
Lists with map and a unique key prop so React can identify each table row:
{
  cycles.map((cycle) => <tr key={cycle.id}>...</tr>);
}
Disabling inputs while a cycle is active with disabled={!!activeCycle} (!! converts the value to a boolean).
14. Icons with Phosphor
Icons are React components, configurable through props:

import { HandPalm, Play, Scroll, Timer } from 'phosphor-react';

<Timer size={24} />;
It also covered importing an SVG as a file (Vite returns the asset URL):

import Logo from '../../assets/Logo.svg';

<img src={Logo} alt="" />;
15. Accessibility
<label htmlFor="task"> linked to the input's id: clicking the text focuses the field, and screen readers announce the label.
alt="" on decorative images so screen readers skip them.
title on icon-only links.
<datalist> for native autocomplete suggestions, no library needed.
Semantic elements: header, nav, main, table/thead/tbody.
A visible :focus style for keyboard users.
The eslint-plugin-jsx-a11y plugin flags accessibility issues right in the editor.
16. Code quality: ESLint and Prettier
The project uses ESLint's new flat config format (eslint.config.js):

@eslint/js → recommended JavaScript rules.
typescript-eslint with recommendedTypeChecked → rules that use TypeScript's type information (projectService: true), such as detecting unhandled Promises.
@eslint-react/eslint-plugin → React-specific best practices.
eslint-plugin-jsx-a11y → accessibility.
eslint-plugin-react-refresh → ensures compatibility with Vite's Fast Refresh.
eslint-plugin-simple-import-sort → sorts imports automatically.
eslint-plugin-prettier/recommended → runs Prettier as an ESLint rule and turns off conflicting style rules (always last).
Per-file-type configuration: browser globals for src, Node globals for config files, and non-type-aware rules for .js.
Custom rules, such as allowing unused variables that start with _.
Prettier (.prettierrc.json): single quotes, semicolons, 2-space indentation, trailing commas, and lines up to 100 characters. .prettierignore excludes dist, node_modules and package-lock.json.

VS Code (.vscode/settings.json): on save, ESLint fixes the file (including formatting and import order).

.npmrc with legacy-peer-deps=true: makes npm ignore peer dependency conflicts between packages, which is common when some libraries don't yet declare support for the newest React version.

17. Google Fonts
In index.html, the Roboto and Roboto Mono fonts are loaded from Google Fonts. The <link rel="preconnect"> tags open the connection to the font servers early, making loading faster. display=swap shows a fallback font while the final font loads.

<p align="center">Feito com 💚 durante o Ignite da Rocketseat · Made with 💚 during Rocketseat's Ignite</p>
