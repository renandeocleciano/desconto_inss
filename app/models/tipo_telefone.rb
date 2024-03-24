# frozen_string_literal: true

class TipoTelefone < ApplicationRecord
  has_many :contatos
end
