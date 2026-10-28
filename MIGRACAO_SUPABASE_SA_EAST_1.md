# Migração do Supabase para sa-east-1 (São Paulo)

**Status:** Pendente  
**Razão:** Reduzir latência de ~150ms (us-east-1) para ~20ms (sa-east-1) para usuários no Brasil.

## Passo a Passo (Seguro e Manual)

### 1. Criar novo projeto em sa-east-1

1. Acesse [supabase.com/dashboard](https://supabase.com/dashboard)
2. Clique **New Project**
3. **Name:** `oab-em-blocos-prod-sa` (ou seu padrão)
4. **Region:** `South America (São Paulo) — sa-east-1`
5. **Database Password:** Copie a senha que será gerada (salve com segurança)
6. Crie o projeto (~2 minutos)

### 2. Copiar schema e dados

Após projeto criado:

1. No novo projeto, vá em **Database** → **Migrations**
2. No seu projeto antigo (us-east-1), vá em **SQL Editor**
3. Rode (copia o schema sem dados):
   ```sql
   pg_dump --schema-only postgres://[user]:[password]@[host]/postgres > schema.sql
   ```
   (Ou use pgAdmin/DBeaver pra exportar schema)
4. No novo projeto, importe o schema via **SQL Editor**

Alternativa (Drizzle):
```bash
# No novo banco (sa-east-1), após conectar via .env.local temporária:
npm run db:push
```

### 3. Migrar dados

Para cada tabela de produção (com dados reais):
```sql
-- Temporariamente no novo banco, copiar dados
INSERT INTO disciplinas SELECT * FROM [replicar da tabela antiga];
-- ... etc para cada tabela
```

**OU** via ferramentas:
- **pgAdmin**: Dump do banco antigo → restore no novo
- **DBeaver**: Export/Import
- **Supabase CLI** (se implementado):
  ```bash
  supabase db pull --db-url postgres://... --output schema.sql
  supabase db push --db-url postgres://[novo]
  ```

### 4. Atualizar variáveis de ambiente

1. Novo projeto, vá em **Project Settings** → **Database**
2. Copie as URLs:
   - **Pooler Connection String** → `DATABASE_URL` (porta 6543, "Transaction" mode)
   - **Direct Connection** → `DATABASE_URL_DIRECT` (porta 5432, se precisar scripts diretos)
3. Atualize no seu `.env.local`:
   ```
   DATABASE_URL=postgresql://[novo-pooler]
   DATABASE_URL_DIRECT=postgresql://[novo-direct]
   ```

### 5. Validar

```bash
# Testar conexão
npm run db:studio

# Rodar seed de testes
npm run db:seed

# Verificar: SELECT COUNT(*) FROM profiles; -- Deve ter dados
```

### 6. Deploy

1. Atualize variáveis no **Vercel** (project settings → Environment Variables)
2. Re-deploy: `git push origin main` ou via Vercel Dashboard
3. Teste em staging/prod

## Timeline

- **Tempo:** ~20-30 minutos (manual)
- **Downtime:** ~5 minutos (ao fazer switch final de URLs)
- **Rollback:** Tem o banco antigo como backup enquanto não apaga

## Checklist

- [ ] Projeto sa-east-1 criado
- [ ] Schema migrado
- [ ] Dados copiados (backup criado em us-east-1)
- [ ] `.env.local` atualizado
- [ ] `npm run db:studio` funciona (conexão validada)
- [ ] Vercel atualizado
- [ ] Produção redeployada
- [ ] Latência testada com DevTools do navegador (~20ms esperado)

## Suporte

Se der erro durante a migração, **não apague o banco antigo** até ter 100% de certeza que o novo funciona. Rolo-back é trivial: restaure as URLs antigas em `.env.local` e redeploye.
