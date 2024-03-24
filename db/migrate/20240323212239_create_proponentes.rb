class CreateProponentes < ActiveRecord::Migration[7.1]
  def change
    create_table :proponentes do |t|
      t.string :nome
      t.integer :cpf
      t.string :data_nascimento
      t.float :salario
      t.float :recolhido

      t.timestamps
    end
  end
end
