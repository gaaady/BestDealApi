# == Schema Information
#
# Table name: hotels
#
#  id         :integer          not null, primary key
#  price      :integer
#  city       :string(255)
#  name       :string(255)
#  image      :string(255)
#  created_at :datetime         not null
#  updated_at :datetime         not null
#  token      :string(255)
#

require 'test_helper'

class HotelTest < ActiveSupport::TestCase
  # test "the truth" do
  #   assert true
  # end
end
