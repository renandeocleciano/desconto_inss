class CreateTipoTelefones < ActiveRecord::Migration[7.1]
  def change
    create_table :tipo_telefones do |t|
      t.string :descricao

      t.timestamps
    end
  end
end
