class AddFaixaToProponentes < ActiveRecord::Migration[7.1]
  def change
    add_column :proponentes, :faixa, :integer
  end
end
