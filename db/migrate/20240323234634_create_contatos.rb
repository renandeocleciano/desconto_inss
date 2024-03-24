# frozen_string_literal: true

class CreateContatos < ActiveRecord::Migration[7.1]
  def change
    create_table :contatos do |t|
      t.string :numero
      t.references :proponente, foreign_key: :proponente_id
      t.references :tipo_telefone
      t.timestamps
    end
  end
end
