# frozen_string_literal: true

json.extract! proponente, :id, :nome, :cpf, :data_nascimento, :salario, :recolhido, :created_at, :updated_at
json.url proponente_url(proponente, format: :json)
