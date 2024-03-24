# frozen_string_literal: true

json.extract! faixa_contribuicao, :id, :min, :max, :aliquota, :created_at, :updated_at
json.url faixa_contribuicao_url(faixa_contribuicao, format: :json)
