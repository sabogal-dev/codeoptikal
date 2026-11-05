/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export async function up(knex) {
    await knex.schema.createTable('usuarios', (table) => {  
        table.increments('id');                          
        table.string('nombre').notNullable();       
        table.string('password_hash').notNullable();
        table.string('rol').notNullable().defaultTo('usuario');
        table.boolean('activo').notNullable().defaultTo(true);
        table.timestamps(true, true);                     
    });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export async function down(knex) {
    await knex.schema.dropTable('usuarios');
};
