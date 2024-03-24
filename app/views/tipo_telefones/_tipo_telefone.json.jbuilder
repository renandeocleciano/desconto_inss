# frozen_string_literal: true

json.extract! tipo_telefone, :id, :descricao, :created_at, :updated_at
json.url tipo_telefone_url(tipo_telefone, format: :json)
