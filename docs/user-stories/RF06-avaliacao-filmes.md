# RF06 – Avaliação de filmes

**Prioridade:** Must Have

## User Story

> **Eu, como** usuário cadastrado,
> **quero** que a opção de avaliar e comentar um filme só apareça depois que eu realmente assisti a ele,
> **para que** as notas e comentários da plataforma sejam confiáveis para os outros usuários.

## Critérios de Aceite

1. **Dado que** o usuário assistiu menos de 90% da duração total do filme,
   **então** o sistema não deve exibir os botões de "Avaliar" e "Comentar".

2. **Dado que** o usuário atingiu 90% do tempo assistido de forma válida (sem pular trechos),
   **então** o sistema deve liberar automaticamente a opção de avaliar e comentar naquele filme.

## Requisitos relacionados
- RF05 – Player de filmes (monitoramento do percentual assistido)
- RF07 – Comentários
- RF08 – Cálculo da avaliação
- RF09 – Créditos por avaliação
