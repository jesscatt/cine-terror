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
├── src/                  # Código-fonte (a definir)
└── README.md
```

## 🚧 Status

Projeto em fase de **levantamento e especificação de requisitos**. A stack de desenvolvimento ainda será definida.

## 👩‍💻 Autoria

Projeto acadêmico de Engenharia de Requisitos.
