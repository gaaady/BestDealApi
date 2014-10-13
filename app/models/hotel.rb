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
#

class Hotel < ActiveRecord::Base
  attr_accessible :city, :image, :name, :price
end
