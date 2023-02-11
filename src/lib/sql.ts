import initSqlJs from "sql.js/dist/sql-asm";

const SQL = initSqlJs();

export async function getSQL() {
	return await SQL;
}