# Requisitos

## Requisitos Funcionais

| ID | Nome | Descrição |
|---|---|---|
| RF01 | Cadastro de usuários | O sistema deve permitir que usuários criem uma conta informando seus dados básicos. |
| RF02 | Login | O sistema deve permitir que usuários cadastrados façam login para acessar suas funcionalidades. |
| RF03 | Cadastro de filmes | O sistema deve permitir o cadastro de filmes de terror, incluindo título, sinopse, ano de lançamento, diretor e imagem. |
| RF04 | Pesquisa de filmes | O sistema deve permitir que os usuários pesquisem filmes pelo título. |
| RF05 | Player de filmes | O sistema deve permitir a reprodução do filme dentro da própria plataforma, monitorando o percentual assistido pelo usuário. |
| RF06 | Avaliação de filmes | O sistema deve permitir que usuários avaliem os filmes de 1 a 5 estrelas, liberando essa opção somente após o usuário ter assistido a, no mínimo, 90% do filme. |
| RF07 | Comentários | O sistema deve permitir que usuários publiquem comentários sobre os filmes, liberado apenas após o usuário ter assistido a, no mínimo, 90% do filme. |
| RF08 | Cálculo da avaliação | O sistema deve calcular automaticamente a média das avaliações recebidas por cada filme. |
| RF09 | Créditos por avaliação | O sistema deve conceder créditos ao usuário ao avaliar um filme (uma avaliação por filme por usuário), acumulando saldo visível ao usuário. |
| RF10 | Loja com desconto por créditos | O sistema deve permitir a compra de produtos personalizados (camisetas, bonés, bolsas) com temas de filmes de terror, usando créditos acumulados como desconto — inclusive no pagamento da assinatura mensal da plataforma. |

## Requisitos Não Funcionais

| ID | Nome | Descrição |
|---|---|---|
| RNF01 | Desempenho | O sistema deve apresentar os resultados das pesquisas e consultas em até 3 segundos em condições normais de uso. |
| RNF02 | Segurança | O sistema deve proteger os dados dos usuários e armazenar as senhas de forma segura. |
| RNF03 | Usabilidade | A interface deve ser simples e intuitiva, permitindo que o usuário encontre e avalie filmes facilmente. |
| RNF04 | Disponibilidade | O sistema deve estar disponível 24 horas por dia, exceto durante períodos programados de manutenção. |
| RNF05 | Compatibilidade mobile | O sistema deve funcionar corretamente em navegadores mobile e/ou como aplicativo, otimizado para smartphones (Android e iOS). |
