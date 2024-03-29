# frozen_string_literal: true

# This file should ensure the existence of records required to run the application in every environment (production,
# development, test). The code here should be idempotent so that it can be executed at any point in every environment.
# The data can then be loaded with the bin/rails db:seed command (or created alongside the database with db:setup).
#
# Example:
#
#   ["Action", "Comedy", "Drama", "Horror"].each do |genre_name|
#     MovieGenre.find_or_create_by!(name: genre_name)
#   end

%w[Pessoal Comercial].each do |telefone_descricao|
  TipoTelefone.find_or_create_by!(
    descricao: telefone_descricao
  )
end

faixas = [
  {
    min: 0,
    max: 1045,
    aliquota: 0.075
  },
  {
    min: 1045.01,
    max: 2089.6,
    aliquota: 0.09
  },
  {
    min: 2089.61,
    max: 3134.40,
    aliquota: 0.12
  },
  {
    min: 3134.41,
    max: 6101.06,
    aliquota: 0.14
  }
]

faixas.each do |faixa|
  FaixaContribuicao.find_or_create_by!(faixa)
end

%w[Renan Maria José João Pedro Paulo Bruna].each do |proponente|
  Proponente.find_or_create_by(
    nome: proponente,
    cpf: '999999999',
    data_nascimento: '01/01/1987',
    salario: 3000,
    recolhido: 281.62,
    faixa: 3
  )
end

Contato.find_or_create_by(
  numero: '(21)9999-22265',
  proponente: Proponente.all.sample,
  tipo_telefone: TipoTelefone.all.sample
)
