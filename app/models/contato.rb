# frozen_string_literal: true

class Contato < ApplicationRecord
  belongs_to :proponente, foreign_key: :proponente_id
  belongs_to :tipo_telefone
end
