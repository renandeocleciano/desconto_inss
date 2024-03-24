# This file is auto-generated from the current state of the database. Instead
# of editing this file, please use the migrations feature of Active Record to
# incrementally modify your database, and then regenerate this schema definition.
#
# This file is the source Rails uses to define your schema when running `bin/rails
# db:schema:load`. When creating a new database, `bin/rails db:schema:load` tends to
# be faster and is potentially less error prone than running all of your
# migrations from scratch. Old migrations may fail to apply correctly if those
# migrations use external dependencies or application code.
#
# It's strongly recommended that you check this file into your version control system.

ActiveRecord::Schema[7.1].define(version: 2024_03_23_234634) do
  create_table "contatos", force: :cascade do |t|
    t.string "numero"
    t.integer "proponente_id"
    t.integer "tipo_telefone_id"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["proponente_id"], name: "index_contatos_on_proponente_id"
    t.index ["tipo_telefone_id"], name: "index_contatos_on_tipo_telefone_id"
  end

  create_table "faixa_contribuicaos", force: :cascade do |t|
    t.float "min"
    t.float "max"
    t.float "aliquota"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
  end

  create_table "proponentes", force: :cascade do |t|
    t.string "nome"
    t.integer "cpf"
    t.string "data_nascimento"
    t.float "salario"
    t.float "recolhido"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
  end

  create_table "tipo_telefones", force: :cascade do |t|
    t.string "descricao"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
  end

  add_foreign_key "contatos", "proponentes"
end
