import { loadSchemaXml } from '@ja-platform/parser-schema-xml';
import { beforeAll } from 'vitest';
import { Database, DBSchema as Schema, WebSQLAdapter } from '../../src';

beforeAll(async () => {
  if ((window as any).openDatabase == undefined) {
    const openDatabase = require('websql');
    (window as any).openDatabase = () => {
      return openDatabase(':memory:', '1.0', 'Test database', 1);
    };
  }
});

export interface DBTestContext {
  adapter: WebSQLAdapter;
  schema: Schema;
  db: any;
}

export async function setupContext(schemaXML: string): Promise<DBTestContext> {
  await WebSQLAdapter.clear();
  const adapter = new WebSQLAdapter({ name: 'objects', stf: false });
  await adapter.open();

  const schema = loadSchemaXml({ source: schemaXML });
  const db = new Database(schema, adapter);

  return {
    adapter,
    schema,
    db
  };
}
