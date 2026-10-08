# 🎬 Cine Terror

Plataforma de streaming **mobile-first** dedicada a filmes de terror, onde a avaliação e os comentários só são liberados para quem **realmente assistiu** ao filme — garantindo notas confiáveis para a comunidade.

## 💡 A ideia

Em muitas plataformas, qualquer pessoa pode dar nota a um filme sem tê-lo visto. No Cine Terror, o player monitora o quanto o usuário assistiu e só libera **Avaliar** e **Comentar** após **90% do filme assistido de forma válida** (sem pular trechos). Quem avalia ganha **créditos**, que no futuro poderão ser usados como desconto na loja de produtos temáticos e na assinatura.

## ✨ Funcionalidades previstas (v1)

| Prioridade | Funcionalidade |
|---|---|
| Must | Cadastro e login de usuários |
| Must | Cadastro de filmes (título, sinopse, ano, diretor, imagem) |
| Must | Player com monitoramento do percentual assistido |
| Must | Avaliação de 1 a 5 estrelas (liberada após 90%) |
| Must | Cálculo automático da média de avaliações |
| Should | Pesquisa de filmes por título |
| Should | Comentários (liberados após 90%) |
| Could | Créditos por avaliação |
| Won't (v1) | Loja com desconto por créditos · Suporte desktop/tablet |

Detalhes completos em [`docs/`](docs/).

## 📚 Documentação

- [Requisitos funcionais e não funcionais](docs/requisitos.md)
- [Priorização MoSCoW](docs/priorizacao-moscow.md)
- [Elicitação (roteiro de entrevista)](docs/elicitacao.md)
- [User Story — RF06 Avaliação de filmes](docs/user-stories/RF06-avaliacao-filmes.md)

## 🗂️ Estrutura do repositório

```
cine-terror/
├── docs/                 # Engenharia de requisitos
│   ├── requisitos.md
│   ├── priorizacao-moscow.md
│   ├── elicitacao.md
│   └── user-stories/
│       └── RF06-avaliacao-filmes.md
├── index.html            # Página do app
├── src/
│   ├── app.js            # Telas, regras (90%, média, créditos)
│   ├── data.js           # Catálogo inicial de filmes
│   └── styles.css        # Visual mobile-first
└── README.md
```

## 🚧 Status

**v0.1 — protótipo no ar (Vercel).** Site estático em HTML, CSS e JavaScript puro, sem etapa de build.

Já funciona:
- Cadastro e login (senha guardada com sal + SHA-256) — RF01, RF02
- Catálogo com 6 clássicos do terror em domínio público (Internet Archive) e cadastro de novos filmes — RF03
- Pesquisa por título — RF04
- Player que mede só o que foi **realmente assistido** (pular trechos não conta) — RF05
- Avaliação 1–5 ★ e comentários liberados apenas a partir de 90% — RF06, RF07
- Média automática das notas — RF08
- +10 créditos na primeira avaliação de cada filme — RF09

### Perfis de acesso

| Perfil | Pode |
|---|---|
| **ADM / Dev** | Tudo do usuário + cadastrar filmes, abrir o Painel (lista de usuários, remover filmes, zerar dados de teste) |
| **Usuário** | Assistir, pesquisar, avaliar, comentar e acumular créditos |

Duas contas já vêm prontas: **ADM** (`adm@cineterror.dev`) e **Jéssika Rodrigues** (`jessika@cineterror.dev`, usuário). Quem se cadastra pelo site entra como usuário. As senhas não ficam no código, só o hash.

> ⚠️ Nesta versão os dados ficam salvos **no navegador** de cada pessoa (localStorage). O próximo passo é ligar um back-end (ex.: Supabase) para que contas, notas e comentários sejam compartilhados entre todos.

**Dica para apresentação:** o player tem velocidade de até 16x, para mostrar a liberação dos 90% sem esperar o filme inteiro.

## 👩‍💻 Autoria

Projeto acadêmico de Engenharia de Requisitos.
