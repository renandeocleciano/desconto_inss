class CreateFaixaContribuicaos < ActiveRecord::Migration[7.1]
  def change
    create_table :faixa_contribuicaos do |t|
      t.float :min
      t.float :max
      t.float :aliquota

      t.timestamps
    end
  end
end
