# Configuração

Para configurar o projeto, você precisa definir algumas variáveis de ambiente. Crie um arquivo .env na raiz do projeto e adicione as seguintes linhas:

```console
DIRECTUS_ACESS_TOKEN=''
DIRECTUS_URL_API=''
TRANSFERENCIAS_URL=''
```

# Uso do WebScraping

Dentro da pasta 'src/scheduleservices', há um arquivo chamado 'transferenciaMensalMunicipiosService.ts'. Este arquivo contém a classe responsável pela execução do scraping.

O método que inicia o processo é o 'startProcess'. Este é um método assíncrono que espera dois parâmetros: 'year' e 'month'. Ambos devem ser strings.

'year' deve estar no formato 'YYYY' (por exemplo, '2023').
'month' deve estar no formato 'MM' (por exemplo, '11').
Substitua os valores vazios pelas informações corretas.

# Documentação do Projeto

## Descrição

Este projeto é um serviço de transferência mensal para municípios. Ele é escrito em TypeScript e usa o pacote `dotenv` para gerenciar variáveis de ambiente.

## Como usar

Para usar este projeto, você precisará ter Node.js e npm instalados em seu ambiente. Você também precisará configurar um arquivo `.env` na raiz do projeto com as variáveis de ambiente necessárias.

Para iniciar o processo, execute o seguinte comando no terminal:

```bash
pnpm run start
```

Isso iniciará o processo de transferência mensal para os municípios.
